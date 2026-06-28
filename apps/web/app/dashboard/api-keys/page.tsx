"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Copy, Check, ShieldCheck } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Card } from "@/components/ui/card";
import Navbar from "@/app/components/layout/navbar";
import Footer from "@/app/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function GenerateKeyPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const captchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onCaptchaVerify = (token: string) => setCaptchaToken(token);
  const onCaptchaExpire = () => setCaptchaToken(null);

  const handleGenerate = async () => {
    if (!captchaToken || isGenerating || apiKey) return;
    setIsGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const randomPart =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      setApiKey(`ds_live_7f7eff_${randomPart}`);
    } catch (error) {
      console.error("Failed to generate key", error);
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
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-neutral min-h-screen flex flex-col">
      <Navbar />

      <main className="grow relative flex w-full flex-col items-center justify-center px-4 md:px-12 py-24 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#7F7EFF]/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="z-10 flex w-full max-w-md flex-col items-center text-center">
          <div className="mb-12">
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">
              API Access
            </h1>
            <p className="mx-auto max-w-xs text-neutral-400">
              Generate a production key for the DStats Analytics engine.
            </p>
          </div>

          <motion.div layout className="w-full">
            <Card className="flex w-full flex-col items-center gap-6 rounded-xl border border-white/10 bg-[#121212]/60 p-10 shadow-2xl backdrop-blur-lg">
              <AnimatePresence mode="popLayout">
                {!apiKey && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex w-full justify-center"
                  >
                    <HCaptcha
                      sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || ""}
                      onVerify={onCaptchaVerify}
                      onExpire={onCaptchaExpire}
                      theme="dark"
                      ref={captchaRef}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                onClick={handleGenerate}
                disabled={!captchaToken || isGenerating || apiKey !== null}
                render={
                  <button
                    className={`flex w-full items-center justify-center gap-3 rounded-lg py-6 text-lg font-bold text-white transition-all ${
                      apiKey
                        ? "cursor-default bg-green-500/20 text-green-400 hover:bg-green-500/20"
                        : !captchaToken
                          ? " text-neutral-500 cursor-not-allowed border border-white/10"
                          : "bg-linear-to-r from-[#7F7EFF] to-[#A390E4] shadow-lg shadow-[#7F7EFF]/20 hover:opacity-90"
                    }`}
                  />
                }
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin text-white" />{" "}
                    Processing...
                  </>
                ) : apiKey ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-white" /> Key
                    Generated
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-6 w-6 text-white" /> Generate API
                    Key
                  </>
                )}
              </Button>

              <AnimatePresence>
                {apiKey && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex w-full flex-col gap-3 border-t border-white/10 pt-6"
                  >
                    <p className="text-left text-xs font-semibold uppercase tracking-widest text-[#7F7EFF]">
                      Your API Key
                    </p>
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-neutral p-3">
                      <code className="truncate font-mono text-sm text-[#7F7EFF]">
                        {apiKey}
                      </code>
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-md text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
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
