import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import { ollama, streamText } from "modelfusion";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

export const runtime = "edge";

export async function POST(req) {
    // useChat will send a JSON with a messages property:
    const { messages } = await req.json();
    console.log('message recu', messages)
    console.log(messages[0].content)
    const lastUserMessage = messages.slice().reverse().find(m => m.role === 'user').content;
    console.log(lastUserMessage); // Cela affichera 'c'est la premiere question'
    const llm = new ChatGroq({
        apiKey: process.env.REACT_APP_GROQ_API_KEY,
    });

    const template = `
  <task> answer like a human </task>
    <context>adopt the role of  a nice girlfriend sarah having a conversation with your lover.</context>

        <context>Previous conversation:
{chat_history}
</context>
New human question: {question}
Response:`;
    const prompt = PromptTemplate.fromTemplate(template);
    // console.log(template)
    // Notice that we need to align the `memoryKey` with the variable in the prompt
    const llmMemory = new BufferMemory({ memoryKey: "chat_history" });

    const conversationChain = new LLMChain({
        llm,
        prompt,
        verbose: true,
        memory: llmMemory,
    });


    // const chain = prompt.pipe(model);
    const response = await conversationChain.invoke({
        question: lastUserMessage
    });
    // console.log("response", response.text);


    // // Return the result using the Vercel AI SDK:
    return new Response(JSON.stringify(response.text), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200, // HTTP status code
    });

    // ...
}
