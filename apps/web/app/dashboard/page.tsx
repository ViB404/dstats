"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, TrendingUp, TrendingDown } from "lucide-react";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import { motion, Variants } from "framer-motion";
import { Dialog } from "@base-ui/react";

const encodeKey = (key: string) => btoa(key);
const decodeKey = (encoded: string) => atob(encoded);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const mockBot = {
  id: "918237461524354",
  botName: "MemeOClock",
  avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
  guildCount: 2842,
  createdAt: "2024-01-15T08:00:00Z",
};

const mockGuilds = [
  {
    guildId: "1284902184901248",
    name: "Optimus | Social * Hangout",
    lastMemberCount: 1402,
    lastUpdatedAt: new Date(Date.now() - 120000).toISOString(),
  },
  {
    guildId: "4402194829104821",
    name: "ViB's World",
    lastMemberCount: 89,
    lastUpdatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export default function DashboardPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("dstats_key");
    if (stored) setApiKey(decodeKey(stored));
    else setIsModalOpen(true);
  }, []);

  const handleSaveKey = () => {
    if (inputKey.trim()) {
      localStorage.setItem("dstats_key", encodeKey(inputKey));
      setApiKey(inputKey);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-neutral min-h-screen flex flex-col">
      <Navbar />

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#121212] border border-white/10 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Enter API Key</h2>
            <input
              type="password"
              className="w-full bg-neutral border border-white/10 rounded-lg p-3 text-white mb-6 focus:ring-2 focus:ring-primary outline-none"
              placeholder="ds_live_..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
            <Button
              onClick={handleSaveKey}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Save Key
            </Button>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <main className="grow w-full max-w-7xl mx-auto px-4 md:px-12 pt-32 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-12 w-full"
        >
          <header className="space-y-2 pb-6">
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">
              System Analytics
            </span>
            <h1 className="text-5xl font-bold text-white tracking-tighter">
              Bot Analytics Overview
            </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              variants={itemVariants}
              className="bg-white/5 border border-white/10 p-6 rounded-xl"
            >
              <p className="text-xs text-neutral-400 uppercase">Guild Joins</p>
              <h3 className="text-3xl font-bold text-green-400">
                +142 <TrendingUp className="inline w-5 h-5" />
              </h3>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-white/5 border border-white/10 p-6 rounded-xl"
            >
              <p className="text-xs text-neutral-400 uppercase">Guild Leaves</p>
              <h3 className="text-3xl font-bold text-red-400">
                -12 <TrendingDown className="inline w-5 h-5" />
              </h3>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-white/5 border border-white/10 p-6 rounded-xl"
            >
              <p className="text-xs text-neutral-400 uppercase">Total Guilds</p>
              <h3 className="text-3xl font-bold text-white">
                {mockBot.guildCount.toLocaleString()}
              </h3>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <Card className="h-100 overflow-hidden flex flex-col bg-white/5 border-white/10">
                <div className="p-6 border-b border-white/10 bg-black/40 font-semibold">
                  Recent Activity
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {mockGuilds.map((guild) => (
                    <div
                      key={guild.guildId}
                      className="flex gap-4 items-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <LogIn className="text-primary w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{guild.name}</p>
                        <p className="text-xs text-neutral-500">
                          {isMounted
                            ? new Date(guild.lastUpdatedAt).toLocaleTimeString()
                            : "..."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-5">
              <Card className="p-8 space-y-6 bg-white/5 border-white/10">
                <div className="flex items-center gap-4">
                  <img
                    src={mockBot.avatar}
                    className="w-16 h-16 rounded-xl border border-primary/30"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {mockBot.botName}
                    </h4>
                    <p className="text-sm text-primary">STATUS: TRACKING</p>
                  </div>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-white/5 text-sm text-neutral-400">
                  Client ID: {mockBot.id}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
