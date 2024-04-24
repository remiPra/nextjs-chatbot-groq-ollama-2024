import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";


export async function POST(req) {
  const requestBody = await req.json();
  console.log('Request Body:', requestBody);

  const { messages, fileText } = requestBody;
  if (!messages) {
    console.error('No messages found in request body.');
    return new Response('Bad Request: No messages provided.', { status: 400 });
  }
  if (!fileText) {
    console.error('No fileText found in request body.');
    return new Response('Bad Request: No fileText provided.', { status: 400 });
  }
 
  


  return new Response(JSON.stringify("filetext"), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}