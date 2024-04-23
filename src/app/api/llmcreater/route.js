import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import { ollama, streamText } from "modelfusion";
export const runtime = "edge";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";



let index = 0;

export async function POST(req) {
    const { messages } = await req.json();
    const model = new ChatOllama({
        baseUrl: "http://localhost:11434",
        model: "mistral",
    });

    let template = ""
    console.log(index)


    template = ` , 
        
        Previous conversation:
        {chat_history}
        
        new human question  : {question}
        Response:`;

    const prompt = PromptTemplate.fromTemplate(template);
    const chain = new ConversationChain({
        llm: model,
        memory: memory,
        prompt: prompt,
        inputKey: "question"
    });
    console.log(messages[index].content)
    const res1 = await chain.invoke({ question: messages[index].content });


    index++;

    return new Response(JSON.stringify(res1), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    });
}