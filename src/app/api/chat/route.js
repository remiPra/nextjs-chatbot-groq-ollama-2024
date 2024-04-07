import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import { ollama, streamText } from "modelfusion";
export const runtime = "edge";

export async function POST(req) {
    // useChat will send a JSON with a messages property:
    const { messages } = await req.json();
    const model = ollama
        .ChatTextGenerator({ model: "mistral" })
        .withChatPrompt();
    console.log("test")
    const prompt = {
        system: `adoptle role de super conseiller , le dieu du conseil
         `,

        // map Vercel AI SDK Message to ModelFusion ChatMessage:
        messages: asChatMessages(messages),
    };
    const textStream = await streamText({ model, prompt });
    // Return the result using the Vercel AI SDK:
    return new StreamingTextResponse(ModelFusionTextStream(textStream));

    // ...
}
