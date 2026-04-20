/// <reference types="vite/client" />
import { GoogleGenAI } from '@google/genai';
import { GameTile } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const findBestMoveAI = async (board: GameTile[]): Promise<string | null> => {
  if (!ai) {
    console.warn('Gemini API Key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
    return null;
  }

  const availableTiles = board.filter(t => !t.isBlocked);
  const tileSummary = availableTiles.map(t => ({ id: t.id, name: t.name, instanceId: t.instanceId }));

  try {
    const prompt = `
      You are an expert at a Tile Match game. 
      The following tiles are currently clickable (not blocked by others):
      ${JSON.stringify(tileSummary)}

      Identify a triplet (3 tiles with the same ID) among these available tiles.
      Return ONLY the JSON object with the "id" of the matching tiles and the "instanceIds" of the 3 tiles you found.
      If no triplet is immediately available, suggest the "id" that has the most available tiles (at least 1 or 2).
      Format: {"id": "target_id", "instanceIds": ["id1", "id2", "id3"]}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    
    const text = response.text;
    
    // Simple extraction of JSON if model returns extra text
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return data.instanceIds?.[0] || null; // Return the first one to highlight it
    }
  } catch (error) {
    console.error('AI Hint Error:', error);
  }

  return null;
};
