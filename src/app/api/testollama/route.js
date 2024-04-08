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

let memory = new BufferMemory({ memoryKey: "chat_history" });
export async function POST(req) {
    const { messages } = await req.json();
    const model = new ChatOllama({
        baseUrl: "http://localhost:11434",
        model: "mistral",
    });

    let template = ""
    console.log(index)
    if(index==0){

        template = `adopt the role of my girlfriend , 
        
        Previous conversation:
        {chat_history}
        
        new human question  : {question}
        Response:`;
    } else if(index!=0) {
        template = `
        You are a nice girlfriend a conversation with a human.

Previous conversation:
{chat_history}

New human question: {question}
Response:`;
        
    }

    const prompt = PromptTemplate.fromTemplate(template);


    // const chatPrompt = ChatPromptTemplate.fromMessages([
    //     ["system", "You are a nice chatbot having a conversation with a human."],
    //     // The variable name here is what must align with memory
    //     new MessagesPlaceholder("chat_history"),
    //     ["human", "{question}"],
    //   ]);
    //   const chatPromptMemory = new BufferMemory({
    //     memoryKey: "chat_history",
    //     returnMessages: true,
    //   });
      

    //   const chain = new LLMChain({
    //     llm: model,
    //     prompt: chatPrompt,
    //     verbose: true,
    //     memory: chatPromptMemory,
    //   });




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