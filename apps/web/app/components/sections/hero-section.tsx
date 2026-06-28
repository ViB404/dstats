"use client";

import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, Variants } from "framer-motion";
import { Bot, TrendingUp, TrendingDown, ShieldCheck } from "lucide-react";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function HeroSection() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative flex min-h-[80vh] w-full max-w-7xl items-center px-4 py-20 mx-auto md:px-12"
    >
      <div className="grid w-full items-center gap-16 lg:grid-cols-2">
        
        <div className="flex flex-col gap-8">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 w-fit">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              SDK v0.1 Live
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl font-bold leading-tight tracking-tighter md:text-7xl text-white">
            Analytics for <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Discord Bots.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="max-w-lg text-lg text-neutral-400">
            Monitor guild joins, leaves, and bot activity with a single API key. Connect your client, and DStats handles the infrastructure automatically.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-4">
            <Button
              render={
                <Link 
                  href="/dashboard/api-keys"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-5 font-semibold text-tertiary shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                >
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Generate API Key
                </Link>
              }
            />
            
            <Button
              render={
                <Link 
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-5 font-semibold text-white transition-all hover:bg-white/10"
                >
                  Read Documentation
                </Link>
              }
            />
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="relative aspect-square w-full lg:aspect-auto perspective-1000">
          <div className="absolute -inset-10 rounded-full bg-primary/10 blur-[100px]"></div>
          
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            className="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 ease-linear md:p-8"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-6" style={{ transform: "translateZ(30px)" }}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-neutral-900">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase text-neutral-500">Connected Bot</p>
                  <h3 className="font-semibold text-white">MemeOClock</h3>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span> Online
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4" style={{ transform: "translateZ(50px)" }}>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <p className="mb-1 font-mono text-xs text-neutral-500">Total Guilds</p>
                <p className="text-3xl font-bold text-white">12,842</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <p className="mb-1 font-mono text-xs text-neutral-500">Last Seen</p>
                <p className="text-lg font-medium text-white">Just now</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <p className="mb-1 font-mono text-xs text-neutral-500">Guild Joins</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-green-400">+142</p>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <p className="mb-1 font-mono text-xs text-neutral-500">Guild Leaves</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-red-400">-12</p>
                  <TrendingDown className="h-4 w-4 text-red-400" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </motion.section>
  );
}