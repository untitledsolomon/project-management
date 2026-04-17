"use client";

import * as React from "react";
import { X, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "@/components/providers/WorkspaceProvider";

export function CreateLeadDialog({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addLead } = useWorkspace();
  const [formData, setFormData] = React.useState({
    company: "",
    type: "SaaS",
    value: "-bashk"
  });

  const handleSubmit = () => {
    addLead({
      company: formData.company,
      type: formData.type,
      value: formData.value,
      status: "Qualified",
      confidence: 50,
      icon: "🏢"
    });
    onClose();
    setFormData({ company: "", type: "SaaS", value: "-bashk" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[150]"
          />
          <div className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white border border-border-base shadow-2xl rounded-card overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-base">
                <h2 className="text-lg font-display flex items-center gap-2">
                  <Sparkles size={18} className="text-accent" />
                  New Regent Lead
                </h2>
                <button onClick={onClose} className="text-muted hover:text-primary">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-muted mb-2 block">Company Name</label>
                  <Input
                    placeholder="e.g. Lunar Optics"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-muted mb-2 block">Type</label>
                    <select
                      className="w-full h-10 px-3 bg-surface-2 border border-border-base rounded-input text-sm outline-none focus:border-accent transition-all"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option>SaaS</option>
                      <option>Hardware</option>
                      <option>Service</option>
                      <option>Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-muted mb-2 block">Value</label>
                    <Input
                      placeholder="e.g. 0k"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                    />
                  </div>
                </div>
                <Button
                  className="w-full h-11 gap-2"
                  disabled={!formData.company}
                  onClick={handleSubmit}
                >
                  Add Lead <Check size={18} />
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
