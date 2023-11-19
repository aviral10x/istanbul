import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { ethers } from "ethers";
import { model } from "@/lib/gptmodal";

type Data = {
  role: string | null;
  content: string | null;
};

// Utility function to extract ENS name
const extractENSName = (messages: any) => {
  // Regular expression for ENS names (basic version)
  const ensRegex = /\b[a-zA-Z0-9-]+\.eth\b/g;

  // Searching each message for ENS names
  for (let message of messages) {
    const ensMatch = message.content.match(ensRegex);
    if (ensMatch) {
      return ensMatch[0]; // Return the first ENS name found
    }
  }

  return null; // Return null if no ENS name is found
};

// API Handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = req.body;
  const { messages } = body;

  // Initialize OpenAI
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Extract ENS name using the utility function
  const ensName = extractENSName(messages);
  if (!ensName) {
    // Handle the case where no ENS name is found
    res
      .status(400)
      .json({ role: null, content: "No ENS name found in the messages" });
    return;
  }

  // Connect to an Ethereum provider and resolve the ENS name
  const provider = new ethers.JsonRpcProvider(
    process.env.ETHEREUM_PROVIDER_URL
  );
  try {
    const resolvedAddress = await provider.resolveName(ensName);
    console.log(resolvedAddress);
    if (!resolvedAddress) {
      console.error("ENS name could not be resolved");
      res
        .status(400)
        .json({ role: null, content: "ENS name could not be resolved" });
      return;
    }
    // Add logic to handle the resolved address
  } catch (error) {
    console.error("Error resolving ENS name: ", error);
    res.status(500).json({ role: null, content: null });
    return;
  }

  // Here, you can modify your messages array to include the resolved address
  // or handle it however your logic requires

  // OpenAI processing
  try {
    const completion = await openai.chat.completions.create({
      messages: [...model, ...messages],
      model: "gpt-3.5-turbo",
    });

    console.log(messages);
    res.status(200).json({
      role: "assistant",
      content: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error with OpenAI completion: ", error);
    res.status(500).json({ role: null, content: null });
  }
}
