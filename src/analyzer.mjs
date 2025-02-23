import OpenAI from "openai";
const openai = new OpenAI(process.env.OPENAI_API_KEY);

/**
 * Sends file content to OpenAI for analysis.
 */
export async function analyzeContent(content, model = "gpt-4o-mini", customPrompt) {
    if (!openai) {
      throw new Error("OPENAI_API_KEY environment variable not set.");
    }
    // Append the file content to the custom prompt.
    const prompt = `${customPrompt || "Please analyze the following file content:"}\n\n${content}`;
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: "You are an AI assistant that helps analyze code." },
          { role: "user", content: prompt },
        ],
        store: true, // Remove or adjust if unsupported.
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI API:");
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response Data:", error.response.data);
      }
      console.error("Error Message:", error.message);
      return "No result from OpenAI due to an error. Please check the logs for more details.";
    }
  }
  
  /**
   * Sends the project structure to OpenAI for analysis.
   */
  export async function analyzeProject(structure, model = "gpt-4o-mini", customPrompt) {
    if (!openai) {
      throw new Error("OPENAI_API_KEY environment variable not set.");
    }
    const prompt = customPrompt || `Here is my project structure: ${JSON.stringify(structure)}`;
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: "You are an AI assistant that helps analyze code." },
          { role: "user", content: prompt },
        ],
        store: true,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI API:");
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response Data:", error.response.data);
      }
      console.error("Error Message:", error.message);
      return "No result from OpenAI due to an error. Please check the logs for more details.";
    }
  }