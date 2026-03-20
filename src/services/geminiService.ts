import { GoogleGenAI, Type } from "@google/genai";
import { Task, Insight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateDynamicInsights(tasks: Task[]): Promise<Partial<Insight>[]> {
  try {
    const completedTasks = tasks.filter(t => t.completed);
    const pendingTasks = tasks.filter(t => !t.completed);
    const highPriorityTasks = tasks.filter(t => t.priority === 'High' || t.priority === 'Urgent');
    
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay = "morning";
    if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    if (hour >= 17) timeOfDay = "evening";

    const prompt = `
      You are a high-performance productivity coach for an app called Luminance.
      Current Time: ${timeOfDay} (${now.toLocaleTimeString()})
      
      Based on the user's current task list and the time of day, provide 2 unique, highly motivating, and situation-aware insights.
      
      User's Tasks:
      ${tasks.map(t => `- ${t.title} (${t.category}, Priority: ${t.priority}, ${t.completed ? 'Completed' : 'Pending'})`).join('\n')}
      
      Context:
      - Completed: ${completedTasks.length}
      - Pending: ${pendingTasks.length}
      - High/Urgent Priority Pending: ${highPriorityTasks.filter(t => !t.completed).length}
      - Total: ${tasks.length}
      
      Rules:
      1. Be concise (max 2 sentences per insight).
      2. Use architectural/design metaphors (e.g., "blueprints", "structure", "clarity", "foundation", "scaffolding", "facade", "interior flow").
      3. Be unique. Don't use the same phrases. 
      4. Situation-aware: 
         - If it's morning and they have many tasks, talk about "laying the foundation".
         - If it's evening and they have completed many, talk about "the structure standing tall".
         - If they have urgent tasks pending, focus on "structural integrity".
      5. Return exactly 2 insights in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["productivity", "focus"] }
            },
            required: ["title", "description", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      {
        title: "Momentum Check",
        description: "Your architectural foundation is being laid. Keep the focus sharp.",
        type: "productivity"
      }
    ];
  }
}
