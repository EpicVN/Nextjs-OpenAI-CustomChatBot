import { useState } from "react";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import { AIChatbot } from "./ai-chatbot";

export const AIChatbotButton = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setChatbotOpen(true)}>
        <Bot size={20} className="mr-2" />
        AI Chat
      </Button>

      <AIChatbot open={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </>
  );
};
