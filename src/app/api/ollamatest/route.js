import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import { ollama, streamText } from "modelfusion";
export const runtime = "edge";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { BufferMemory } from "langchain/memory";

let index = 0
let memory = new BufferMemory({ memoryKey: "chat_history" });


export async function POST(req) {
    const { messages } = await req.json();
    console.log(messages)
    const model = new ChatOllama({
        baseUrl: "http://localhost:11434", // Default value
        model: "mistral", // Default value
    });
    const stream = await model
        .pipe(new StringOutputParser())
        .stream(messages[index].content);

    const chunks = [];
    index++
    for await (const chunk of stream) {
        chunks.push(chunk);
    }

    return new Response(JSON.stringify(chunks.join("")), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200, // HTTP status code
    });
    
   
}
