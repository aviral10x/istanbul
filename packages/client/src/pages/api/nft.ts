// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { model } from '@/lib/gptmodal'

type Data = {
  role: string | null
  content: string | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const body = await req.body
  const { messages } = body
  const openai = new OpenAI({
    apiKey: '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',
  })
  const completion = await openai.chat.completions.create({
    messages: [...model, ...messages],
    model: 'gpt-3.5-turbo',
  })

  console.log(messages)
  res.status(200).json({
    role: 'assistant',
    content: completion.choices[0].message.content,
  })
}
