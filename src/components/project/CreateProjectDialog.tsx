"use client";

import * as React from "react";
import { X, Layout, Users, Calendar, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "@/components/providers/WorkspaceProvider";

export function CreateProjectDialog({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addProject } = useWorkspace();
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: "",
    client: "",
    template: "Blank"
  });

  const handleSubmit = () => {
    addProject({
      name: formData.name,
      client: formData.client,
      progress: 0,
      tasks: 0,
      status: "In Progress",
      statusColor: "text-status-progress-text bg-status-progress-bg"
    });
    onClose();
    setStep(1);
    setFormData({ name: "", client: "", template: "Blank" });
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
              className="w-full max-w-xl bg-white border border-border-base shadow-2xl rounded-card overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-base">
                <h2 className="text-lg font-display flex items-center gap-2">
                  <Layout size={18} className="text-accent" />
                  Create New Project
                </h2>
                <button onClick={onClose} className="text-muted hover:text-primary">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="text-xs font-mono uppercase tracking-widest text-muted mb-2 block">Project Name</label>
                        <Input
                          placeholder="e.g. Q4 Brand Identity"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase tracking-widest text-muted mb-2 block">Client</label>
                        <Input
                          placeholder="e.g. Internal or Client Name"
                          value={formData.client}
                          onChange={(e) => setFormData({...formData, client: e.target.value})}
                        />
                      </div>
                      <Button
                        className="w-full h-11 gap-2"
                        disabled={!formData.name}
                        onClick={() => setStep(2)}
                      >
                        Next Step <ArrowRight size={18} />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <label className="text-xs font-mono uppercase tracking-widest text-muted mb-2 block">Select Template</label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Blank", "Software", "Marketing", "Research"].map(t => (
                          <button
                            key={t}
                            onClick={() => setFormData({...formData, template: t})}
                            className={`p-4 border rounded-card text-left transition-all ${formData.template === t ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border-base hover:border-accent/50"}`}
                          >
                            <p className="font-medium text-sm text-primary">{t}</p>
                            <p className="text-[10px] text-muted font-mono">Standard workflow</p>
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                        <Button className="flex-[2] h-11 gap-2" onClick={handleSubmit}>
                          Create Project <Check size={18} />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
