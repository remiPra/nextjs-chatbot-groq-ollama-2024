import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import { ollama, streamText, embedMany, retrieve, VectorIndexRetriever } from "modelfusion";

export const runtime = "edge";

export async function POST(req) {
  const requestBody = await req.json();
  console.log('Request Body:', requestBody);

  // Charger le fichier de texte à l'aide de TextLoader
  const docs = requestBody.fileText; // Assurez-vous que c'est une chaîne de texte.
  console.log(docs);

  const { messages } = requestBody;
  if (!messages) {
    console.error('No messages found in request body.');
    return new Response('Bad Request: No messages provided.', { status: 400 });
  }

  const fileEmbeddings = await embedMany({
    model: ollama.TextEmbedder({ model: "nomic-embed-text" }),
    values: [requestBody.fileText],
  });

  const model = ollama.ChatTextGenerator({ model: "mistral" }).withChatPrompt();
  const chunks = await retrieve(
    new VectorIndexRetriever({
      vectorIndex: fileEmbeddings,
      embeddingModel: ollama.TextEmbedder({ model: "nomic-embed-text" }),
      maxResults: 3,
      similarityThreshold: 0.8,
    }),
    messages[0].content
  );

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
}