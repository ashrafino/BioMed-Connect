
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getPanneAnalysis(equipmentName: string, description: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
      Tu es un expert en maintenance biomédicale. Analyse la panne suivante :
      Équipement: ${equipmentName}
      Description: ${description}

      Fournis 3 à 4 solutions possibles ou étapes de vérification sous forme de liste à puces.
      Formatte ta réponse comme ceci:
      - Solution 1
      - Solution 2
      ...
      `
    });

    const text = response.text || "";
    
    return text.split('\n')
      .map(line => line.replace(/^- /, '').trim())
      .filter(line => line.length > 0);
  } catch (error) {
    console.error("Gemini Error:", error);
    return ["Vérifier l'alimentation électrique", "Consulter le manuel technique", "Contacter le support fabricant"];
  }
}
