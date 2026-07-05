"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Fingerprint,
} from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/app/components/layout/navbar";
import Footer from "@/app/components/layout/footer";

export default function GenerateKeyPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const [botName, setBotName] = useState("");
  const [botId, setBotId] = useState("");
  const [botAvatar, setBotAvatar] = useState("");
  const [ownerId, setOwnerId] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onCaptchaVerify = (token: string) => setCaptchaToken(token);
  const onCaptchaExpire = () => setCaptchaToken(null);

  const isFormValid =
    botName.trim() !== "" && botId.trim() !== "" && captchaToken !== null;

  const handleGenerate = async () => {
    if (!isFormValid || isGenerating || apiKey) return;
    setIsGenerating(true);

    const toastId = toast.loading("Processing your payload...");

    try {
      const payload = {
        hcaptcha_token: captchaToken,
        bot_id: botId.trim(),
        bot_name: botName.trim(),
        bot_avatar: botAvatar.trim() || null,
        owner_id: ownerId.trim() || null,
      };

      const response = await fetch(`${process.env.PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Backend rejected the payload.", {
          id: toastId,
          description: `Status Code: ${response.status}`,
        });
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
        setIsGenerating(false);
        return;
      }

      setApiKey(data.data.api_key);
      toast.success("Production API Key generated successfully!", {
        id: toastId,
      });
    } catch (error) {
      toast.error("A network or parsing error occurred.", {
        id: toastId,
      });
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    toast.success("API Key copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isMounted) return null;

  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="grow relative flex w-full flex-col items-center justify-center px-4 md:px-12 py-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7F7EFF]/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="z-10 flex w-full max-w-lg flex-col items-center text-center">
          <div className="mb-10">
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-white">
              API Access
            </h1>
            <p className="mx-auto max-w-sm text-neutral-400">
              Register your bot to generate an API key for DStats
            </p>
          </div>

          <motion.div layout className="w-full">
            <Card className="flex w-full flex-col items-center gap-6 rounded-2xl border border-white/10 bg-[#121212]/80 p-8 shadow-2xl backdrop-blur-xl">
              <AnimatePresence mode="popLayout">
                {!apiKey && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="w-full flex flex-col gap-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div className="space-y-2">
                        <Label
                          htmlFor="botName"
                          className="text-neutral-300 text-xs uppercase tracking-wider flex items-center gap-1"
                        >
                          <Cpu className="w-3 h-3" /> Bot Name *
                        </Label>
                        <Input
                          id="botName"
                          placeholder="e.g. DStats Manager"
                          value={botName}
                          onChange={(e) => setBotName(e.target.value)}
                          className="bg-neutral-900/50 border-white/10 text-white focus-visible:ring-[#7F7EFF]/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="botId"
                          className="text-neutral-300 text-xs uppercase tracking-wider flex items-center gap-1"
                        >
                          <Fingerprint className="w-3 h-3" /> Bot ID *
                        </Label>
                        <Input
                          id="botId"
                          type="text"
                          inputMode="numeric"
                          placeholder="e.g. 1048291..."
                          value={botId}
                          onChange={(e) => setBotId(e.target.value)}
                          className="bg-neutral-900/50 border-white/10 text-white focus-visible:ring-[#7F7EFF]/50 font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="botAvatar"
                          className="text-neutral-400 text-xs uppercase tracking-wider"
                        >
                          Avatar URL (Optional)
                        </Label>
                        <Input
                          id="botAvatar"
                          type="url"
                          placeholder="https://..."
                          value={botAvatar}
                          onChange={(e) => setBotAvatar(e.target.value)}
                          className="bg-neutral-900/50 border-white/5 text-neutral-300 focus-visible:ring-[#7F7EFF]/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="ownerId"
                          className="text-neutral-400 text-xs uppercase tracking-wider"
                        >
                          Owner ID (Optional)
                        </Label>
                        <Input
                          id="ownerId"
                          type="text"
                          inputMode="numeric"
                          placeholder="Your Discord ID"
                          value={ownerId}
                          onChange={(e) => setOwnerId(e.target.value)}
                          className="bg-neutral-900/50 border-white/5 text-neutral-300 focus-visible:ring-[#7F7EFF]/50 font-mono"
                        />
                      </div>
                    </div>

                    <div className="mt-2 flex w-full justify-center">
                      <HCaptcha
                        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || ""}
                        onVerify={onCaptchaVerify}
                        onExpire={onCaptchaExpire}
                        theme="dark"
                        ref={captchaRef}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                onClick={handleGenerate}
                disabled={!isFormValid || isGenerating || apiKey !== null}
                className={`flex w-full h-14 items-center justify-center gap-3 rounded-xl text-lg font-bold text-white transition-all duration-300 ${
                  apiKey
                    ? "cursor-default bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20"
                    : !isFormValid
                      ? "text-neutral-500 bg-neutral-900/50 cursor-not-allowed border border-white/5"
                      : "bg-linear-to-r from-[#7F7EFF] to-[#A390E4] shadow-[0_0_20px_rgba(127,126,255,0.3)] hover:shadow-[0_0_30px_rgba(127,126,255,0.5)] hover:scale-[1.02]"
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    Processing Data...
                  </>
                ) : apiKey ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" /> Active
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" /> Generate Key
                  </>
                )}
              </Button>

              <AnimatePresence>
                {apiKey && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mt-2 flex w-full flex-col gap-3 border-t border-white/10 pt-6"
                  >
                    <p className="text-left text-xs font-semibold uppercase tracking-widest text-[#7F7EFF]">
                      Production API Key
                    </p>
                    <div className="flex items-center justify-between rounded-xl border border-[#7F7EFF]/30 bg-[#7F7EFF]/5 p-3 group hover:border-[#7F7EFF]/60 transition-colors">
                      <code className="truncate font-mono text-sm text-white/90 ml-2">
                        {apiKey}
                      </code>
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-white/5 text-neutral-300 hover:bg-[#7F7EFF]/20 hover:text-white transition-all active:scale-95"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 text-left">
                      * Store this key securely. You won&apos;t be able to see
                      it again.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
