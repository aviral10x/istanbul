//import { auth } from "@clerk/nextjs";
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

//import { checkSubscription } from "@/lib/subscription";
//import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// const instructionMessage: ChatCompletionRequestMessage = {
//   role: "system",
//   content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
// };

export async function POST(req: Request) {
  try {
    //const { userId } = auth();
    const body = await req.json()
    const { messages } = body

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    // if (!configuration.apiKey) {
    //   return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    // }

    if (!messages) {
      return new NextResponse('Messages are required', { status: 400 })
    }

    // const freeTrial = await checkApiLimit();
    // const isPro = await checkSubscription();

    // if (!freeTrial && !isPro) {
    //   return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    // }
    const openai = new OpenAI({ apiKey: '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' })
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Who won the world series in 2020?' },
        { role: 'assistant', content: 'The Los Angeles Dodgers won the World Series in 2020.' },
        { role: 'user', content: 'Where was it played?' },
      ],
      model: 'gpt-3.5-turbo',
    })

    // const response = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: [instructionMessage, ...messages]
    // });

    // if (!isPro) {
    //   await incrementApiLimit();
    // }

    return NextResponse.json(completion.choices[0].message.content)
  } catch (error) {
    console.log('[CODE_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
