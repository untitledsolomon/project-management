"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Check, Users, Plus, Layout, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    workspace: "",
    teamSize: "1-10",
    projects: []
  });

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Progress Dots */}
      <div className="flex gap-2 mb-12">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? "w-8 bg-accent" : "w-1.5 bg-border-base"}`}
          />
        ))}
      </div>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="h-16 w-16 bg-accent/5 text-accent rounded-card flex items-center justify-center mx-auto mb-8 border border-accent/10">
                <Layers size={32} />
              </div>
              <h1 className="text-4xl font-display text-primary mb-4">Let&apos;s set up your workspace</h1>
              <p className="text-secondary mb-8 leading-relaxed">Axis helps you manage projects with precision. Give your digital workspace a name to begin.</p>

              <div className="space-y-6 text-left">
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-muted mb-2 block">Workspace Name</label>
                  <Input placeholder="e.g. Acme Design Studio" className="h-12 text-lg" />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-muted mb-3 block">Team Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["1-10", "11-50", "50+"].map(size => (
                      <button
                        key={size}
                        onClick={() => setFormData({...formData, teamSize: size})}
                        className={`py-2 text-sm rounded-badge border transition-all ${formData.teamSize === size ? "bg-accent border-accent text-white" : "border-border-base hover:border-accent/50"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={nextStep} className="w-full h-12 text-base gap-2 group">
                  Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="h-16 w-16 bg-accent/5 text-accent rounded-card flex items-center justify-center mx-auto mb-8 border border-accent/10">
                <Users size={32} />
              </div>
              <h2 className="text-4xl font-display text-primary mb-4">Invite your team</h2>
              <p className="text-secondary mb-8 leading-relaxed">Collaborate in real-time. You can also skip this and invite them later from settings.</p>

              <div className="space-y-4 text-left mb-8">
                <div className="flex gap-2">
                  <Input placeholder="colleague@company.com" className="h-12" />
                  <Button variant="secondary" className="h-12 px-6">Add</Button>
                </div>
                <div className="bg-surface-2 rounded-card p-4 border border-border-base border-dashed">
                  <p className="text-xs text-muted text-center italic">No invites added yet</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={nextStep} className="w-full h-12 text-base">Send Invites</Button>
                <button onClick={nextStep} className="text-sm text-muted hover:text-primary transition-colors">Skip for now</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="h-16 w-16 bg-accent/5 text-accent rounded-card flex items-center justify-center mx-auto mb-8 border border-accent/10">
                <Layout size={32} />
              </div>
              <h2 className="text-4xl font-display text-primary mb-4">Create your first project</h2>
              <p className="text-secondary mb-8 leading-relaxed">Select a template to kickstart your workflow or start from scratch.</p>

              <div className="grid grid-cols-2 gap-4 text-left mb-8">
                {[
                  { name: "Software Dev", icon: "💻", color: "bg-blue-50" },
                  { name: "Brand Design", icon: "🎨", color: "bg-purple-50" },
                  { name: "Marketing", icon: "📢", color: "bg-orange-50" },
                  { name: "Blank", icon: "📄", color: "bg-gray-50" },
                ].map(t => (
                  <button key={t.name} className="p-4 border border-border-base rounded-card hover:border-accent hover:shadow-sm transition-all text-left group">
                    <div className={`h-8 w-8 rounded mb-3 flex items-center justify-center text-lg ${t.color}`}>{t.icon}</div>
                    <p className="text-sm font-semibold group-hover:text-accent">{t.name}</p>
                  </button>
                ))}
              </div>

              <Link href="/">
                <Button className="w-full h-12 text-base gap-2">
                  Finish Setup <Check size={18} />
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
