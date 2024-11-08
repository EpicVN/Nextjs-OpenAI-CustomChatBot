import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { Bot, Trash, X, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Message } from "ai";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Key, useEffect, useRef, useState } from "react";

interface AIChatbotProps {
  open: boolean;
  onClose: () => void;
}

export const AIChatbot = ({ open, onClose }: AIChatbotProps) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat(); //    /api/chat

  const [input1, setInput1] = useState('');
  const [response, setResponse] = useState<any>([]);

  // Function to handle submitting the input
  const handleSubmit1 = async () => {
    try {
      // Make a POST request to your API route
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      // Parse the response
      const data = await res.json();

      // Update the response state with data from the API
      setResponse(data);
    } catch (error) {
      console.error('Error fetching the chat response:', error);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "z-100 bottom-0 right-0 w-full max-w-[500px] p-1 lg:right-20",
        open ? "fixed" : "hidden",
      )}
    >
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <button onClick={onClose} className="ms-auto block m-2">
          <X size={30} />
        </button>
        <div className="mt-3 h-full overflow-y-auto px-3" ref={scrollRef}>
          {response?.map((message: Pick<Message, "role" | "content">, index: Key | null | undefined) => (
            <ChatMessage message={message} key={index} />
          ))}
          
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}

          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Something went wrong. Please try again.",
              }}
            />
          )}

          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3">
              <Bot />
              Ask the AI a question about you data
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit1} className="m-3 flex gap-1">
          <Button
            title="Clear chat"
            variant="outline"
            size="icon"
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
          >
            <Trash />
          </Button>

          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
            ref={inputRef}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
};

function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) {
  const { user } = useUser();

  const isAIMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAIMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAIMessage && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAIMessage ? "bg-background" : "bg-primary text-primary-foreground",
        )}
      >
        {content}
      </p>

      {!isAIMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="User image"
          width={40}
          height={40}
          className="ml-2 h-10 w-10 rounded-full object-cover"
        />
      )}
    </div>
  );
}
