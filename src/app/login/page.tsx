"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Layers, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-2 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex h-12 w-12 bg-white border border-border-base rounded-card items-center justify-center mb-6 shadow-axis">
            <Layers className="text-accent h-6 w-6" />
          </div>
          <h1 className="text-4xl font-display text-primary mb-2">Welcome to Axis</h1>
          <p className="text-secondary text-sm">Precision project management for high-performance teams.</p>
        </div>

        <div className="bg-white border border-border-base rounded-card p-8 shadow-2xl">
          <div className="space-y-4 mb-8">
            <Button variant="secondary" className="w-full h-11 gap-3 border-border-base text-primary font-medium">
              <ShieldCheck size={18} className="text-accent" />
              Sign in with Regent Auth
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border-base" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted font-mono">Or continue with email</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Email Address</label>
                <Input type="email" placeholder="name@company.com" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Password</label>
                  <button className="text-[10px] font-mono text-accent hover:underline">Forgot?</button>
                </div>
                <Input type="password" placeholder="••••••••" className="h-11" />
              </div>
            </div>
          </div>

          <Link href="/">
            <Button className="w-full h-11 gap-2 text-base group">
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <p className="mt-8 text-center text-xs text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/onboarding" className="text-accent hover:underline font-medium">
              Create a workspace
            </Link>
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 grayscale opacity-40">
          <span className="text-[10px] font-mono uppercase tracking-tighter">Trusted by</span>
          <div className="flex gap-4 items-center">
            <div className="h-4 w-12 bg-muted/40 rounded-sm" />
            <div className="h-4 w-16 bg-muted/40 rounded-sm" />
            <div className="h-4 w-10 bg-muted/40 rounded-sm" />
          </div>
        </div>
      </motion.div>

      <footer className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
          © 2024 Axis Technologies • <Link href="#" className="hover:text-primary transition-colors">Security</Link> • <Link href="#" className="hover:text-primary transition-colors">Status</Link>
        </p>
      </footer>
    </div>
  );
}
