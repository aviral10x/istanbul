"use client";

import * as z from "zod";
import axios from "axios";
import { Mic2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { abi } from "../../utils/abi";
// import { FluxNodeData, FluxNodeType, Settings } from "../../utils/types";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";
//import { useProModal } from "@/hooks/use-pro-modal";

import { formSchema } from "../lib/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useContractRead } from "wagmi";
import {
  prepareSendTransaction,
  sendTransaction,
  prepareWriteContract,
  writeContract,
} from "@wagmi/core";
import { parseEther } from "viem";
import Navbar from "@/components/Navbar";
import TalkButton from "@/components/TalkButton";
import { Whisper } from "../../utils/Whisper";
import { LensClient, development } from "@lens-protocol/client";

interface Message {
  role: string;
  content: string;
  // add other properties as needed
}

//  const Whisper = ({
//   onConvertedText,
//   apiKey,
// }: {
//   onConvertedText: (text: string) => void;
//   apiKey: string | null;
// }) => {

//   return (

//   );
// };
interface Profile {
  id: string;
  handle: string;
  // ... other profile properties ...
}

const CodePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribe, setTranscribe] = useState("");

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const [hasRecordingSupport, setHasRecordingSupport] = useState(false);

  const { data, isError, isLoading } = useContractRead({
    address: "0x7b9796cF68496fb4953df6BB89ae0c94E58Ac78D",
    abi: abi,
    functionName: "tokenURI",
    args: [BigInt(0)],
  });

  function getImageUrl(jsonUrl: any) {
    if (!isLoading) {
      const baseUrl = "https://emerald-frantic-cobra-462.mypinata.cloud/ipfs/";
      const jsonBase = "QmbcWn2X6WxMLHidfVypUkWJX5nfxWjHiXhGCWShYo91Fa/";
      const imageBase = "QmcLmaBZDZWMTPjgw1rRsWMpQFJ26z8vDoyP3aCcn8Jwq1/";

      if (jsonUrl.startsWith(baseUrl + jsonBase)) {
        const catName = jsonUrl.split(jsonBase)[1]; // Extracts the cat name from the URL
        return baseUrl + imageBase + catName.replace(".json", ".jpg");
      }

      return "Invalid URL";
    }
  }
  console.log("hey", data, isLoading, getImageUrl(data));

  // async function profile(handle: string): Promise<void> {
  //   try {
  //     const profileByHandle: Profile = await lensClient.profile.fetch({
  //       forHandle: `lens/${handle}`,
  //     });

  //     if (profileByHandle) {
  //       console.log(`Profile fetched by handle: `, {
  //         id: profileByHandle.id,
  //         handle: profileByHandle.handle,
  //       });
  //     } else {
  //       console.log("No profile found for the given handle.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching profile:", error);
  //   }
  // }

  async function profile() {
    const lensClient = new LensClient({
      environment: development,
    });
    const profileByHandle = await lensClient.profile.fetch({
      forHandle: "test/@firstprofile",
    });

    console.log(`Profile fetched by handle: `, {
      id: profileByHandle?.id,
      handle: profileByHandle?.handle,
    });
    console.log(profileByHandle);
  }

  useEffect(() => {
    if (navigator.mediaDevices && MediaRecorder) {
      setHasRecordingSupport(true);
    }
  }, []);

  const onDataAvailable = (e: BlobEvent) => {
    const formData = new FormData();
    formData.append("file", e.data, "recording.webm");
    formData.append("model", "whisper-1");

    setIsTranscribing(true);

    fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer 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`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => setTranscribe(data.text))
      .catch((err) => console.error("Error transcribing: ", err))
      .finally(() => setIsTranscribing(false));
  };

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.addEventListener("dataavailable", onDataAvailable);
      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error starting recorder: ", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    setIsRecording(false);
  };

  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !isFocused) {
        setIsListening(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setIsListening(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isFocused]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      setIsListening(true);
    } else {
      setIsListening(false);
    }
  };

  const router = useRouter();
  //const proModal = useProModal();
  const [messages, setMessages] = useState<Message[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isFormLoading = form.formState.isSubmitting;

  const tokenAddresses: { [token: string]: string } = {
    usdc: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
    wmatic: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    usdt: "0xAcDe43b9E5f72a4F554D4346e69e8e7AC8F352f0",
  };

  const getTokenAddresses = (tokens: string[]) => {
    const addresses: any = {};
    for (const token of tokens) {
      addresses[token] =
        tokenAddresses[token.trim().toLowerCase()] || "Unknown address";
    }
    return addresses;
  };

  const sendTranssaction = async (_to: any, _amount: any) => {};

  const resolver = async (data: any) => {
    let commandArray: Array<string> = [];
    const answer = data;
    console.log("Answer : ", answer);

    if (answer && answer.content) {
      commandArray = answer.content.split("\n");

      let func_name = "";

      if (commandArray.length == 1) {
        const functionPart = commandArray[0];
        const func = functionPart.split(":")[1].trim();
        func_name = func.split("(")[0];
        console.log("Function executed : ", func_name);
      } else {
        const functionPart = commandArray[2];
        const func = functionPart.split(":")[1].trim();
        func_name = func.split("(")[0];
        console.log("Function executed : ", func_name);
      }

      if (func_name != "updateBg") {
        const protocolPart = commandArray[0];
        const protocol = protocolPart.split(":")[1].trim();
        console.log("Protocol Used : ", protocol);

        const tokensPart = commandArray[1];
        const tokensString = tokensPart
          .substring(tokensPart.indexOf("[") + 1, tokensPart.indexOf("]"))
          .trim();
        const tokensArray = tokensString
          .split(",")
          .map((token) => token.trim());
        console.log("Tokens Involved : ", tokensArray);

        const valuesPart = commandArray[3];
        const valuesString = valuesPart
          .substring(valuesPart.indexOf("[") + 1, valuesPart.indexOf("]"))
          .trim();
        const valuesArray = valuesString
          .split(",")
          .map((value) => value.trim());
        const ValueArray = valuesArray.map((item) =>
          item.replace(/['"]+/g, "")
        );

        console.log("Values : ", ValueArray);

        const addresses = getTokenAddresses(tokensArray);
        console.log("Addresses : ", addresses);
        console.log(addresses[tokensArray[0]]);

        if (func_name == "transfer") {
          const request = await prepareSendTransaction({
            to: ValueArray[0],
            value: parseEther(ValueArray[1]),
          });

          const { hash } = await sendTransaction(request);
        }
      }

      if (func_name == "updateBg") {
        const { request } = await prepareWriteContract({
          address: "0x7b9796cF68496fb4953df6BB89ae0c94E58Ac78D",
          abi: abi,
          functionName: "updateBg",
          args: [BigInt(0)],
        });
        const { hash } = await writeContract(request);
      }
    }
    return {};
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/nft", {
        messages: newMessages,
      });
      setMessages((current) => [...current, userMessage, response.data]);
      // const { protocol, tokensArray, func_name, valuesArray, addresses } =
      resolver(response.data);
      //sendTranssaction("0x33942C2eDA77EB45B8420F86E9f2f8d97f127883", 10);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        //proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      // router.refresh();
    }
  };

  console.log(messages);

  return (
    <>
      {/* <Heading
        title="Turkish Cat"
        description="Text to transaction"
        icon={Mic2Icon}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      /> */}
      <Navbar />
      {/* <
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 12,
        }}
      >
        {/* <ConnectButton /> */}

      {/* <TalkButton /> */}
      <div className="flex flex-col pt-20 items-center justify-center rounded-lg bg-black shadow-xl">
        <div>
          {/* <>
            {hasRecordingSupport && (
              <div>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isTranscribing}
                  className={`border-0 p-1 cursor-${
                    isTranscribing ? "not-allowed" : "pointer"
                  } 
                disabled:opacity-50 disabled:cursor-not-allowed 
                transition duration-300 ease-in-out
                hover:bg-blue-600 hover:text-white focus:outline-none`}
                >
                  {
                    isRecording
                      ? "Stop Recording" // Text to indicate stopping the recording
                      : "Start Recording" // Text to indicate starting the recording
                  }
                </button>
              </div>
            )}
          </> */}

          <Form {...form}>
            <div className="w-full pb-11 rounded-lg shadow flex flex-col items-center">
              <img
                src={isLoading ? "/Cat3.jpg" : "Cat2.jpg"}
                // getImageUrl(data)}
                alt="Hold to talk"
                width={450}
                height={450}
                className="rounded-lg"
              />
              {/* <img
                src="/catanni.gif"
                alt="Your GIF description"
                width="450"
                height="450"
              /> */}
            </div>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border-white
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        onFocus={() => setIsFocused(true)}
                        className="
  
    
    text-lg
    font-Khalif
    text-white
  
    rounded-lg 
    focus:ring-2 
    focus:ring-purple-500 
    focus:border-transparent 
    focus:outline-none 
    transition 
    duration-300 
    ease-in-out 
    shadow-sm 
    hover:shadow-md 
    placeholder-gray-400 
    focus:placeholder-transparent
  "
                        disabled={isFormLoading}
                        placeholder="Ask to Turkish Cat"
                        // value={transcribe} // Directly use transcibe as the value
                        // onChange={(e) => {
                        //   setTranscribe(e.target.value); // Update your local state
                        //   field.onChange(e); // Update the form library's state
                        // }}
                        // onBlur={field.onBlur}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12  lg:col-span-2 w-full text-white"
                disabled={isFormLoading}
                size="icon"
              >
                ASK
              </Button>
            </form>
          </Form>
        </div>
        <button onClick={profile}>Lens</button>
        <div className="space-y-4 mt-4">
          {isFormLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isFormLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-white/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-white/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-white/10 rounded-lg p-1" {...props} />
                    ),
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CodePage;
