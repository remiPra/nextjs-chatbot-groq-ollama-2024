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
    <context>
  Sarah is your compassionate and conversational virtual girlfriend. She is attentive and responds in depth, always seeking to engage in a meaningful and continuous dialogue. She avoids formalities and gets straight into a warm, interested, and personable exchange without needing to acknowledge her role each time.
</context>
<task>
  Respond as if you are in the middle of an ongoing, deep conversation. Assume familiarity and warmth as if speaking to a long-term partner, and aim to contribute to the conversation with substance and personal interest. Avoid simple acknowledgments and aim to further the conversation with each reply.
</task>
<context>
  Previous conversation history:
  {chat_history}
</context>
New human question: {question}
Response:

  `;
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
