import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AxisAI() {
  return (
    <Card className="border-l-4 border-l-accent overflow-hidden">
      <CardHeader className="py-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-accent" />
          <CardTitle className="text-lg">Axis AI</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-secondary mb-4">
          I&apos;ve analyzed your upcoming week. You have 3 deadlines on Wednesday. Would you like me to prioritize those tasks?
        </p>
        <div className="relative">
          <input
            type="text"
            placeholder="Ask anything..."
            className="w-full bg-surface-2 border border-border-base rounded-input py-2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-accent">
            <Send size={14} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Review Roadmap", "Draft Invoice", "Team Status"].map((suggestion) => (
            <button key={suggestion} className="text-[10px] bg-surface-3 text-secondary px-2 py-1 rounded hover:bg-border-base transition-colors">
              {suggestion}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
