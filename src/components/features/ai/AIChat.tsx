import Avatar from "@/components/shared/Avatar";
import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { ChatMessage } from "./AIChatBox";

interface AIChatProps {
  message: ChatMessage;
}

const AIChat: React.FC<AIChatProps> = ({ message }) => {
  const isUserMessage = useMemo(() => message.role === "user", [message]);
  const [htmlMessage, setHtmlMessage] = useState(message.content);

  useEffect(() => {
    const markdown = async () => {
      const { default: md } = await import("markdown-it");

      setHtmlMessage(md().render(message.content));
    };

    markdown();
  }, [message.content]);

  if (message.role === "system") return null;

  return (
    <div
      className={classNames(
        "flex gap-2 rounded-md",
        isUserMessage && "flex-row-reverse"
      )}
    >
      {!isUserMessage && <Avatar className="!w-8 !h-8" src={"/ai.png"} />}

      <div className="relative space-y-1">
        {!isUserMessage && (
          <p className={classNames("font-light text-sm")}>Maid-chan</p>
        )}

        <div
          className={classNames(
            "prose prose-base prose-primary !prose-invert p-2 rounded-md bg-background-600",
            message.isError && "ring-2 ring-red-500"
            // !isUserMessage && "max-w-[90%]"
          )}
          dangerouslySetInnerHTML={{ __html: htmlMessage }}
        />
      </div>
    </div>
  );
};

export default React.memo(AIChat);
