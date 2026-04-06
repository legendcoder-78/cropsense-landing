import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { motion, AnimatePresence } from "framer-motion";
import { askSiteChatbot } from "@/services/siteChatbotAgent";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export function SiteChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          text: "Hi! I'm CropSense AI. I can see the data on this page. What would you like to know?",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const extractPageContext = () => {
    // Attempt to grab text from main container
    const root = document.getElementById("root");
    if (!root) return "";

    // Quick clone or text sweep (filter out script/style/the chatbot itself)
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        // ignore the chatbot container to not feed its own history into prompt excessively
        if (node.parentElement?.closest("#site-chatbot-container")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let text = "";
    let currentNode = walker.nextNode();
    while (currentNode) {
      text += " " + currentNode.nodeValue;
      currentNode = walker.nextNode();
    }

    return text.replace(/\s+/g, " ").trim();
  };

  const handleSend = async () => {
    const text = inputVal.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      const pageContext = extractPageContext();
      const response = await askSiteChatbot(text, pageContext);

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", text: response },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          text: "Sorry, I couldn't reach the AI service right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="site-chatbot-container"
      className="fixed bottom-6 right-6 z-[100] flex flex-col items-end"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-xl border border-border/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary-foreground">
                <Bot className="h-5 w-5" />
                <span className="font-semibold font-display tracking-wide">
                  CropSense AI
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/80 hover:text-white transition-colors"
                title="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Message Area */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className="shrink-0 mt-1">
                      {msg.role === "user" ? (
                        <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center">
                          <User className="h-3 w-3 text-slate-600" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-3 w-3 text-primary" />
                        </div>
                      )}
                    </div>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-white border border-border/50 shadow-sm rounded-tl-none text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="shrink-0 mt-1">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white border border-border/50 shadow-sm rounded-2xl rounded-tl-none flex gap-1">
                      <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
                      <div
                        className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <div
                        className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-border/50 flex gap-2">
              <Input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about this page..."
                className="flex-1 focus-visible:ring-primary shadow-sm"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !inputVal.trim()}
                size="icon"
                className="shrink-0 transition-transform active:scale-95"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center border-2 border-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Toggle chat"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
