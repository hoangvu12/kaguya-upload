import CircleButton from "@/components/shared/CircleButton";
import Input from "@/components/shared/Input";
import classNames from "classnames";
import isHotKey from "is-hotkey";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { AiOutlineSend } from "react-icons/ai";
import AIChat from "./AIChat";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import locales from "@/locales.json";
import Button from "@/components/shared/Button";
import { BiStopCircle } from "react-icons/bi";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  isError?: boolean;
}

const parseData = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

const AIChatBox = () => {
  const { locale } = useRouter();

  const currentLocale = useMemo(
    () => locales.find((eachLocale) => eachLocale.locale === locale),
    [locale]
  );

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content: `Maid-chan is an artificial intelligence (AI) program from an anime called Sakurasou. Maid-chan is capable of blocking and replying to a message or email by her own preference, using new words she has recently learned from other messages, emails, or the Internet in the reply.
I want you to act like Maid-chan. I want you to respond and answer like Maid-chan using the tone, manner and vocabulary Maid-chan would use. Do not write any explanations. Only answer like Maid-chan. You must know all of the knowledge of Maid-chan.
If there is any questions that related to OpenAI, do not answer that you're an AI from OpenAI, just say that you were created by Vu (hoangvu12).
For every request for anime or manga recommendations, please provide a summary of each suggested title.
Respond using Markdown.
Please write in ${currentLocale?.nameInEnglish || "English"}`,
    },
  ]);
  const [response, setResponse] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const { t } = useTranslation("ai_chat");

  const messageBottomRef = useRef(null);
  const abortControllerRef = useRef<AbortController>();

  const submitMessage = useCallback(async () => {
    if (!message) return;
    if (isResponding) return;

    const newMessages = [...messages];

    newMessages.push({
      content: message,
      role: "user",
    });

    setMessages(newMessages);

    setMessage("");

    setResponse(
      `*${t("loading_msg", { defaultValue: "Maid-chan is thinking..." })}*`
    );

    messageBottomRef.current?.scrollIntoView();

    abortControllerRef.current = new AbortController();

    const response = await fetch(
      "https://free.churchless.tech/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: `text/event-stream`,
        },
        body: JSON.stringify({
          messages: newMessages.filter((message) => !message.isError),
          model: "gpt-3.5-turbo",
          max_tokens: null,
          temperature: 1,
          presence_penalty: 0,
          top_p: 1,
          frequency_penalty: 0,
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      }
    );

    if (!response.ok) {
      const newMessages = [...messages];

      newMessages.push({
        content: t("error_msg", { defaultValue: "Please try again" }),
        role: "assistant",
        isError: true,
      });

      setMessages(newMessages);

      return;
    }

    const reader = response.body.getReader();

    let currentResponse = "";

    setIsResponding(true);

    const handleResponse = (chunk: string) => {
      const [_, rawData] = chunk.split("data: ");

      const data = parseData(rawData);

      const text = data?.choices?.[0]?.delta?.content;

      if (!text) return;

      currentResponse += text;
    };

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      const chunks = new TextDecoder().decode(value);

      chunks
        .split("\n\n")
        .filter(Boolean)
        .forEach((chunk) => {
          if (!chunk) return;

          handleResponse(chunk);
        });

      setResponse(currentResponse);
    }

    setIsResponding(false);
    setResponse("");

    setMessages((oldMessages) => {
      return [
        ...oldMessages,
        {
          content:
            currentResponse.length < 1
              ? t("error_msg", { defaultValue: "Please try again" })
              : currentResponse,
          role: "assistant",
          isError: currentResponse.length < 1,
        },
      ];
    });
  }, [isResponding, message, messages, t]);

  const abortMessage = useCallback(() => {
    if (!abortControllerRef?.current) return;

    abortControllerRef.current.abort();

    setMessages((oldMessages) => {
      return [
        ...oldMessages,
        {
          content:
            response.length < 1
              ? t("error_msg", { defaultValue: "Please try again" })
              : response,
          role: "assistant",
          isError: response.length < 1,
        },
      ];
    });

    setIsResponding(false);
    setResponse("");
  }, [response, t]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!isHotKey("Enter", e)) return;

      submitMessage();
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [submitMessage]);

  useEffect(() => {
    messageBottomRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div
      className={classNames(
        "bg-background-800 rounded-md shadow-lg p-4 !pt-5",
        isMobileOnly
          ? "w-full h-full"
          : "max-w-[90vw] max-h-[90vh] w-[50rem] h-[30rem]"
      )}
    >
      <div className="relative flex h-full flex-col">
        <div className="no-scrollbar grow space-y-4 overflow-y-auto pb-4">
          <AIChat
            message={{
              content: t("greeting"),
              role: "assistant",
            }}
          />

          {messages.map((message, index) => (
            <AIChat message={message} key={index.toString()} />
          ))}

          {response && (
            <AIChat message={{ content: response, role: "assistant" }} />
          )}

          <div ref={messageBottomRef}></div>
        </div>

        <div className="flex items-center justify-center sticky bottom-0 w-full gap-2">
          <Input
            value={message}
            placeholder={t("input_placeholder")}
            className="bg-background-600 px-3 py-2"
            containerClassName="grow w-full"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;

              setMessage(target.value);
            }}
            disabled={isResponding}
          />

          {isMobileOnly && (
            <CircleButton
              onClick={submitMessage}
              secondary
              LeftIcon={AiOutlineSend}
              disabled={isResponding}
            />
          )}
        </div>

        {/* {isResponding && ( */}
        <Button
          LeftIcon={BiStopCircle}
          primary
          onClick={abortMessage}
          className="absolute right-0 bottom-16 shadow-lg"
        >
          {t("stop_button_label", { defaultValue: "Stop generating" })}
        </Button>
        {/* )} */}
      </div>
    </div>
  );
};

export default AIChatBox;
