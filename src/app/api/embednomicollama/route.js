import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import { ollama, streamText, embedMany } from "modelfusion";
import {
    MemoryVectorIndex,
    VectorIndexRetriever,
    generateText,
    openai,
    retrieve,
    upsertIntoVectorIndex,
  } from "modelfusion";
  
export const runtime = "edge";

export async function POST(req) {
    // useChat will send a JSON with a messages property:
    const requestBody = await req.json();
    console.log('Request Body:', requestBody);

    // Check if 'messages' is a property of the parsed JSON:
    const { messages } = requestBody;
    if (!messages) {
        console.error('No messages found in request body.');
        return new Response('Bad Request: No messages provided.', { status: 400 });
    }
  
    
      const model = ollama
      .ChatTextGenerator({ model: "mistral" })
      .withChatPrompt();
      const chunks = await retrieve(
        new VectorIndexRetriever({
          vectorIndex: fileEmbeddings,
          embeddingModel: ollama.TextEmbedder({ model: "llama2" }),
          maxResults: 3,
          similarityThreshold: 0.8,
        }),
        messages[0].content
      );
    // Définir le prompt avec les embeddings
    const prompt = {
        system: "Vous êtes un assistant qui répond aux questions en utilisant un fichier de référence donné.",
        messages: [
          {
            role: "user",
            content: messages[0].content,
            embeddings: fileEmbeddings,
          },
          {
            role: "assistant",
            content: `## INFORMATION\n${JSON.stringify(chunks)}`,
          },
        ]
      };
    
      const textStream = await streamText({ model, prompt });
    return new StreamingTextResponse(ModelFusionTextStream(textStream));

    // ...
}
