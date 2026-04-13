"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AxisAI() {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<{ role: string; text: string }[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);

  const handleSend = () => {
    if (!input) return;
    const userMsg = { role: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = {
        role: "ai",
        text: "I've analyzed the project velocity. Based on current trends, we're likely to finish 'Axis Platform' 4 days ahead of schedule. Would you like me to draft the progress report?"
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <Card className="border-l-4 border-l-accent overflow-hidden">
      <CardHeader className="py-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-accent" />
          <CardTitle className="text-lg">Axis AI</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[150px] overflow-y-auto mb-4 space-y-3 custom-scrollbar pr-1">
          {messages.length === 0 && (
            <p className="text-sm text-secondary">
              I&apos;ve analyzed your upcoming week. You have 3 deadlines on Wednesday. Would you like me to prioritize those tasks?
            </p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-badge px-3 py-2 text-xs ${m.role === "user" ? "bg-accent text-white" : "bg-surface-3 text-primary"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-surface-3 text-muted rounded-badge px-3 py-2 text-[10px] flex items-center gap-2">
                <Loader2 size={12} className="animate-spin" />
                Analyzing workspace...
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full bg-surface-2 border border-border-base rounded-input py-2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-accent"
          >
            <Send size={14} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["Review Roadmap", "Draft Invoice", "Team Status"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => { setInput(suggestion); }}
              className="text-[10px] bg-surface-3 text-secondary px-2 py-1 rounded hover:bg-border-base transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
