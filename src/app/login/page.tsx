"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Layers, ShieldCheck, Github, Chrome } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-white border border-border-base rounded-card shadow-2xl overflow-hidden"
      >
        <div className="p-8 pb-4 text-center border-b border-border-base bg-surface-1">
          <div className="h-12 w-12 bg-accent rounded-card flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
            <Layers size={28} />
          </div>
          <h1 className="text-3xl font-display text-primary mb-2">Welcome to Axis</h1>
          <p className="text-secondary text-sm">Sign in to your enterprise workspace.</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <Button variant="secondary" className="w-full gap-3 h-11 border-border-base text-primary hover:bg-surface-2">
              <ShieldCheck size={18} className="text-accent" />
              Sign in with Regent Auth (SSO)
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 gap-2 h-11 border-border-base text-primary">
                <Github size={18} />
                GitHub
              </Button>
              <Button variant="secondary" className="flex-1 gap-2 h-11 border-border-base text-primary">
                <Chrome size={18} />
                Google
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border-base" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted font-mono">or email</span></div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1.5 block">Email Address</label>
              <Input type="email" placeholder="name@company.com" className="h-10" />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1.5 block">Password</label>
              <Input type="password" placeholder="••••••••" className="h-10" />
            </div>
            <Link href="/" className="block">
              <Button className="w-full h-11">Sign In</Button>
            </Link>
          </div>
        </div>

        <div className="p-4 bg-surface-2 border-t border-border-base text-center">
          <p className="text-[10px] text-muted font-mono uppercase tracking-tight">
            New to Axis? <Link href="/onboarding" className="text-accent font-bold hover:underline">Create a workspace</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
