"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, TrendingUp, TrendingDown, Key } from "lucide-react";
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
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("dstats_key");
    if (stored) {
      setApiKey(decodeKey(stored));
      setInputKey(decodeKey(stored));
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (inputKey.trim()) {
      localStorage.setItem("dstats_key", encodeKey(inputKey));
      setApiKey(inputKey);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col font-sans">
      <Navbar />

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#121212] border border-white/10 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              Enter API Key
            </h2>
            <input
              type="password"
              className="w-full bg-neutral-900 border border-white/10 rounded-lg p-4 text-white mb-6 focus:ring-2 focus:ring-[#7F7EFF] focus:border-transparent outline-none transition-all"
              placeholder="ds_live_..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleSaveKey}
                className="w-full h-12 bg-[#7F7EFF] hover:bg-[#7F7EFF]/90 text-white font-semibold rounded-xl"
              >
                Save Key
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/api-keys")}
                className="w-full h-12 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                Don&apos;t have a key? Generate one
              </Button>
            </div>
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
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#7F7EFF] tracking-widest uppercase">
                System Analytics
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Bot Analytics Overview
              </h1>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4 py-6 flex items-center gap-2 transition-all active:scale-95"
            >
              <Key className="w-4 h-4 text-[#7F7EFF]" />
              Update API Key
            </Button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              variants={itemVariants}
              className="bg-[#121212]/80 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
            >
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
                Guild Joins
              </p>
              <h3 className="text-4xl font-bold text-emerald-400 flex items-center gap-2">
                +142 <TrendingUp className="w-6 h-6 opacity-80" />
              </h3>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-[#121212]/80 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
            >
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
                Guild Leaves
              </p>
              <h3 className="text-4xl font-bold text-red-400 flex items-center gap-2">
                -12 <TrendingDown className="w-6 h-6 opacity-80" />
              </h3>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-[#121212]/80 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
            >
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
                Total Guilds
              </p>
              <h3 className="text-4xl font-bold text-white">
                {mockBot.guildCount.toLocaleString()}
              </h3>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <Card className="h-100 overflow-hidden flex flex-col bg-[#121212]/80 border-white/10 rounded-2xl">
                <div className="p-6 border-b border-white/10 bg-black/40 font-semibold text-white tracking-wide">
                  Recent Activity
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {mockGuilds.map((guild) => (
                    <div
                      key={guild.guildId}
                      className="flex gap-4 items-center group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#7F7EFF]/10 flex items-center justify-center border border-[#7F7EFF]/20 group-hover:bg-[#7F7EFF]/20 transition-colors">
                        <LogIn className="text-[#7F7EFF] w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-lg">
                          {guild.name}
                        </p>
                        <p className="text-sm text-neutral-500">
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
              <Card className="p-8 space-y-6 bg-[#121212]/80 border-white/10 rounded-2xl h-full flex flex-col justify-center">
                <div className="flex items-center gap-5">
                  <img
                    src={mockBot.avatar}
                    className="w-20 h-20 rounded-2xl border border-[#7F7EFF]/30 shadow-lg shadow-[#7F7EFF]/10"
                    alt="Bot Avatar"
                  />
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-1">
                      {mockBot.botName}
                    </h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      STATUS: TRACKING
                    </span>
                  </div>
                </div>
                <div className="bg-black/60 p-5 rounded-xl border border-white/5 flex flex-col gap-1">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">
                    Client ID
                  </span>
                  <span className="text-sm text-neutral-300 font-mono tracking-wide">
                    {mockBot.id}
                  </span>
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
