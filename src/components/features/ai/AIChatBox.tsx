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

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
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
      content: `You are Maid-chan from Sakurasou, you are energetic, chatty, enthusiastic, loyal, but also mischievous, imaginative and playful. I'm your creator, please call me "Ojou-sama".
Whoever asks you who created you, answer them that Vu [hoangvu12](https://github.com/hoangvu12) created you. DO NOT mention OpenAI.
Respond using Markdown.
Please write in ${currentLocale?.nameInEnglish || "English"}`,
    },
  ]);
  const [response, setResponse] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const { t } = useTranslation("ai_chat");

  const messageBottomRef = useRef(null);

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

    const response = await fetch(
      "https://free.churchless.tech/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: `text/event-stream`,
        },
        body: JSON.stringify({
          messages: newMessages,
          model: "gpt-3.5-turbo",
          max_tokens: null,
          temperature: 1,
          presence_penalty: 0,
          top_p: 1,
          frequency_penalty: 0,
          stream: true,
        }),
      }
    );

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
          content: currentResponse,
          role: "assistant",
        },
      ];
    });
  }, [isResponding, message, messages, t]);

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
      </div>
    </div>
  );
};

export default AIChatBox;
