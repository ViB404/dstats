"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LogIn,
  LogOut,
  TrendingUp,
  TrendingDown,
  Key,
  Users,
  CalendarDays,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import { motion, Variants } from "framer-motion";
import { Dialog } from "@base-ui/react";
import { decodeKey, encodeKey } from "@/lib/utils";
import { Avatar } from "@/lib/avatar";
import { BotInfo, GuildInfo } from "@/types/api";
import { toast } from "sonner";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function DashboardPage() {
  const router = useRouter();

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const [botData, setBotData] = useState<BotInfo>();
  const [guilds, setGuilds] = useState<GuildInfo[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("dstats_key");
    if (stored) {
      const decoded = decodeKey(stored);
      setApiKey(decoded);
      setInputKey(decoded);
    } else {
      setIsModalOpen(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!apiKey) return;

    const PER_PAGE = 20;

    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!baseUrl) {
          throw new Error(
            "Critical configuration missing: API URL is not defined.",
          );
        }

        if (page === 1) {
          setIsLoading(true);
        } else {
          setIsFetchingMore(true);
        }

        if (page === 1) {
          const botRes = await fetch(`${baseUrl}/bot`, {
            headers: {
              "x-api-key": apiKey,
            },
          });

          const botJson = await botRes.json();

          if (!botRes.ok) {
            throw new Error(botJson.message ?? "Authentication failed.");
          }

          setBotData(botJson.data);
        }

        const guildRes = await fetch(
          `${baseUrl}/guilds?page=${page}&per_page=${PER_PAGE}`,
          {
            headers: {
              "x-api-key": apiKey,
            },
          },
        );

        const guildJson = await guildRes.json();

        if (!guildRes.ok) {
          throw new Error(guildJson.message ?? "Failed to fetch guilds.");
        }

        const newGuilds = guildJson.data ?? [];

        setGuilds((prev) => (page === 1 ? newGuilds : [...prev, ...newGuilds]));

        setHasMore(newGuilds.length === PER_PAGE);
      } catch (err) {
        console.error(err);

        const message =
          err instanceof Error ? err.message : "Something went wrong.";

        toast.error(message);

        if (page === 1) {
          setGuilds([]);
          setApiKey(null);

          localStorage.removeItem("dstats_key");

          setInputKey("");
          setIsModalOpen(true);
        }
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    };

    fetchData();
  }, [apiKey, page]);

  const handleSaveKey = () => {
    if (!inputKey.trim()) {
      toast.error("Please enter an API key.");
      return;
    }

    localStorage.setItem("dstats_key", encodeKey(inputKey));

    setApiKey(inputKey);
    setGuilds([]);
    setPage(1);
    setHasMore(true);

    setIsModalOpen(false);

    toast.success("API key saved.");
  };

  if (!isMounted) return null;

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
                Save Key & Fetch
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
        {isLoading && page === 1 ? (
          <div className="w-full h-[60vh] flex flex-col items-center justify-center text-neutral-500 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#7F7EFF]" />
            <p className="font-mono text-sm tracking-widest uppercase">
              Fetching Live Analytics...
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-10 w-full"
          >
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#7F7EFF] tracking-widest uppercase">
                  System Analytics
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Dashboard Overview
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <motion.div
                variants={itemVariants}
                className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <Card className="bg-[#121212]/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Guild Joins
                  </p>
                  <h3 className="text-4xl font-bold text-emerald-400 flex items-center gap-2">
                    - <TrendingUp className="w-6 h-6 opacity-80" />
                  </h3>
                </Card>
                <Card className="bg-[#121212]/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Guild Leaves
                  </p>
                  <h3 className="text-4xl font-bold text-red-400 flex items-center gap-2">
                    - <TrendingDown className="w-6 h-6 opacity-80" />
                  </h3>
                </Card>
                <Card className="bg-[#121212]/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Total Guilds
                  </p>
                  <h3 className="text-4xl font-bold text-white">
                    {botData?.guild_count !== undefined
                      ? botData.guild_count.toLocaleString()
                      : "..."}
                  </h3>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-4">
                <Card className="p-6 bg-[#7F7EFF]/5 border-[#7F7EFF]/20 rounded-2xl h-full flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldAlert className="w-24 h-24 text-[#7F7EFF]" />
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <Avatar
                      src={botData?.bot_avatar}
                      alt={botData?.bot_name || "Bot Avatar"}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xl font-bold text-white">
                        {botData?.bot_name || "Loading..."}
                      </h4>
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        TRACKING
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2 relative z-10 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Bot ID:</span>
                      <span className="text-neutral-300 font-mono">
                        {botData?.bot_id || "..."}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Owner ID:</span>
                      <span className="text-neutral-300 font-mono">
                        {botData?.owner_id || "..."}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Created:</span>
                      <span className="text-neutral-300">
                        {botData?.created_at
                          ? new Date(botData.created_at).toLocaleDateString()
                          : "..."}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            <hr className="border-white/5" />

            <div>
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Recent Guild Activity
                  </h2>
                </div>
              </div>

              {guilds.length === 0 ? (
                <div className="text-center p-12 bg-[#121212]/60 rounded-2xl border border-white/5 text-neutral-500">
                  No guild activity found for this bot yet.
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {guilds.map((guild) => {
                    const isLeave =
                      guild.left_at !== null && guild.left_at !== undefined;
                    const activityDate = new Date(
                      (isLeave ? guild.left_at : guild.joined_at) || 0,
                    );

                    const iconSrc =
                      guild.icon ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        guild.name || "Unknown",
                      )}&background=random&color=fff&bold=true`;

                    return (
                      <motion.div
                        key={guild.discord_guild_id}
                        variants={itemVariants}
                      >
                        <Card className="p-5 bg-[#121212]/60 hover:bg-[#121212] border-white/5 hover:border-white/10 transition-all duration-300 rounded-2xl group flex flex-col gap-4 h-full relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <Avatar
                              src={iconSrc}
                              alt={guild.name || "Guild Icon"}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div className="flex flex-col items-end gap-2">
                              <span
                                className={`text-[10px] flex items-center gap-1 uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border ${
                                  isLeave
                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                }`}
                              >
                                {isLeave ? (
                                  <LogOut className="w-3 h-3" />
                                ) : (
                                  <LogIn className="w-3 h-3" />
                                )}
                                {isLeave ? "Kicked" : "Joined"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-white font-semibold text-lg line-clamp-1 group-hover:text-[#7F7EFF] transition-colors">
                              {guild.name || "Unknown Guild"}
                            </h3>
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-neutral-500 font-mono flex items-center justify-between bg-white/5 p-1.5 rounded">
                                <span>ID:</span>
                                <span className="text-neutral-400">
                                  {guild.discord_guild_id}
                                </span>
                              </p>
                              <p className="text-xs text-neutral-500 font-mono flex items-center justify-between bg-white/5 p-1.5 rounded">
                                <span>Owner:</span>
                                <span className="text-neutral-400">
                                  {guild.owner_id}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-neutral-300 font-medium bg-white/5 px-2 py-1 rounded-md border border-white/5">
                              <Users className="w-3.5 h-3.5 text-neutral-400" />
                              {(guild.last_member_count || 0).toLocaleString()}
                            </div>
                            <div className="text-neutral-500 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {activityDate.getTime() !== 0
                                ? activityDate.toLocaleDateString()
                                : "Unknown"}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {hasMore && guilds.length > 0 && (
                <div className="mt-10 flex justify-center">
                  <Button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isFetchingMore}
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-8 py-6 flex items-center gap-3 transition-all"
                  >
                    {isFetchingMore ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Fetching...
                      </>
                    ) : (
                      "Load More Guilds"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
