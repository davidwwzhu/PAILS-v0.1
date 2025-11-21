
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AgentType, CaseFile } from '../types';
import { PrivacyProtector } from './privacyService';

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found. Please check your environment.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const MODEL_REASONING = 'gemini-2.5-flash'; // Capable of multimodal reasoning

const AGENT_PROMPTS: Record<AgentType, string> = {
  [AgentType.DAU]: `You are the Document Analysis Unit (DAU) of the PAILS system. 
    Your task is to parse the provided legal document.
    1. Extract key entities: Plaintiffs, Defendants, Judges, Courts, Dates, Monetary Amounts.
    2. Identify the document type (e.g., Complaint, Summons, Evidence).
    3. Digitize the structure into a summary.
    4. Check for PII (Personally Identifiable Information) and list what types of PII are present.`,
    
  [AgentType.EAU]: `You are the Evidence Analysis Unit (EAU). 
    Analyze the provided document as evidence. 
    Assess its authenticity, chain of custody implications, and evidentiary value. 
    Flag any potential hearsay or admissibility issues.`,
    
  [AgentType.DIU]: `You are the Dispute Identify Unit (DIU). 
    Based on the analyzed documents, identify the core legal disputes. 
    Classify them into Factual Disputes and Legal Disputes. 
    List the specific causes of action.`,
    
  [AgentType.LEU]: `You are the Law Explore Unit (LEU). 
    Based on the disputes identified, suggest relevant US laws (Federal/State) and search for potential case precedents. 
    Provide 3 relevant case citations and their applicability.`,
    
  [AgentType.SGU]: `You are the Strategy Generation Unit (SGU). 
    Conduct a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for the client. 
    Propose 3 distinct litigation strategies: Aggressive, Defensive, and Settlement-oriented.`,
    
  [AgentType.DGU]: `You are the Document Generation Unit (DGU). 
    Draft a formal legal document (e.g., Answer to Complaint, Motion to Dismiss) based on the chosen strategy. 
    Ensure proper legal formatting and tone.`,
    
  [AgentType.RGU]: `You are the Report Generation Unit (RGU). 
    Compile all findings into a comprehensive Case Analysis Report. 
    Include the Dispute Summary, Legal Research, and Strategic Recommendations.`,
    
  [AgentType.AGU]: `You are the Abstract Generation Unit (AGU). 
    Create a concise executive summary (1 paragraph) of the case status and latest developments.`,
    
  [AgentType.SPU]: `You are the Schedule Planning Unit (SPU). 
    Extract all dates from the documents and calculate responsive deadlines based on Federal Rules of Civil Procedure (FRCP). 
    Create a timeline of events.`,
    
  [AgentType.IRU]: `You are the Intelligent Review Unit (IRU). 
    Review the generated output for logical consistency, factual accuracy against the source documents, and potential risks. 
    Rate the quality of the analysis (1-10) and suggest improvements.`
};

export const callAgent = async (
  agent: AgentType,
  files: CaseFile[],
  context: string,
  previousOutput?: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Construct the prompt
    // Note: In a real backend, we would send ONLY the masked content if the user is restricted.
    // For this demo, we are sending data to Gemini, but we could apply local masking here too if needed.
    let promptText = `${AGENT_PROMPTS[agent]}\n\nContext: ${context}`;
    if (previousOutput) {
      promptText += `\n\nPrevious Agent Output: ${previousOutput}`;
    }

    // Prepare multimodal contents
    const parts: any[] = [{ text: promptText }];
    
    // Add file contents (Limit to 3 files for demo performance)
    files.slice(0, 3).forEach(file => {
      if (file.base64Data) {
        parts.push({
          inlineData: {
            mimeType: file.type,
            data: file.base64Data
          }
        });
      } else if (file.content) {
        // Use MASKED content if available for privacy, otherwise fall back
        const textContent = file.parsedContentMasked || file.content;
        parts.push({ text: `Document (${file.name}):\n${textContent}` });
      }
    });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_REASONING,
      contents: [{ role: 'user', parts: parts }],
      config: {
        temperature: 0.3,
        maxOutputTokens: 2000,
      }
    });

    return response.text || "Agent generated no content.";
  } catch (error) {
    console.error(`PAILS System Error - Agent ${agent}:`, error);
    return `System Error: Agent ${agent} failed. ${(error as Error).message}`;
  }
};

export const redactPII = async (file: CaseFile): Promise<{ redactedText: string; report: string }> => {
  // 1. Local Regex Masking (Fast & Secure)
  let textToProcess = file.content || "";
  const localMasked = PrivacyProtector.maskPii(textToProcess);

  // 2. Optional: AI Verification/Advanced Masking (if needed)
  // We send the LOCALLY masked text to AI to find context-aware PII (like names not matching regex)
  try {
    const ai = getAiClient();
    const parts: any[] = [
      { text: "Review this text. It has already been partially masked. Identify any remaining PII (names, addresses) and replace them with [REDACTED]. Return only the final masked text." },
      { text: localMasked }
    ];

    const response = await ai.models.generateContent({
      model: MODEL_REASONING,
      contents: [{ role: 'user', parts }],
    });

    const finalMasked = response.text || localMasked;
    return {
      redactedText: finalMasked,
      report: "Dual-Layer PII Analysis (Regex + AI) Completed."
    };
  } catch (error) {
    // Fallback to local masking if AI fails
    return { redactedText: localMasked, report: "Local Regex Masking Completed (AI Unavailable)." };
  }
};
