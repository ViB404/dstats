"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useRegisterBot } from "@/hooks/use_register_bot";
import { RegisterForm } from "@/components/forms/register_form";
import { ApiKeyResult } from "@/components/forms/api_key_result";

export default function GenerateKeyPage() {
	const [isMounted, setIsMounted] = useState(false);
	const {
		clientId,
		setClientId,
		ownerId,
		setOwnerId,
		setCaptchaToken,
		captchaRef,
		isFormValid,
		isGenerating,
		apiKey,
		generateKey,
	} = useRegisterBot();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<div className="bg-background min-h-screen flex flex-col font-sans text-foreground">
			<Navbar />

			<main className="grow relative flex w-full flex-col items-center justify-center px-4 md:px-12 py-24 overflow-hidden">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

				<div className="z-10 flex w-full max-w-lg flex-col items-center text-center">
					<div className="mb-10">
						<h1 className="mb-3 text-4xl font-heading font-extrabold tracking-tight text-foreground">
							API Access
						</h1>
						<p className="mx-auto max-w-sm text-muted-foreground">
							Register your bot to generate an API key for DStats
						</p>
					</div>

					<motion.div layout className="w-full">
						<Card className="flex w-full flex-col items-center gap-6 rounded-2xl border border-border bg-card/80 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.1)_inset,0_10px_20px_rgba(110,140,251,0.08)] backdrop-blur-xl">
							<AnimatePresence mode="popLayout">
								{!apiKey && (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, height: 0, scale: 0.95 }}
										className="w-full"
									>
										<RegisterForm
											clientId={clientId}
											setClientId={setClientId}
											ownerId={ownerId}
											setOwnerId={setOwnerId}
											onVerify={setCaptchaToken}
											onExpire={() => setCaptchaToken(null)}
											captchaRef={captchaRef}
										/>
									</motion.div>
								)}
							</AnimatePresence>

							<Button
								onClick={generateKey}
								disabled={!isFormValid || isGenerating || apiKey !== null}
								className={`flex w-full h-14 items-center justify-center gap-3 rounded-xl text-lg font-bold transition-all duration-300 ${
									apiKey
										? "cursor-default bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20"
										: !isFormValid
											? "text-muted-foreground bg-muted/50 cursor-not-allowed border border-border"
											: "bg-linear-to-r from-(--color-primary) to-(--color-secondary) text-primary-foreground shadow-[0_10px_20px_rgba(110,140,251,0.2)] hover:shadow-[0_15px_30px_rgba(110,140,251,0.35)] hover:scale-[1.02]"
								}`}
							>
								{isGenerating ? (
									<>
										<Loader2 className="h-5 w-5 animate-spin text-primary-foreground" />
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

							<AnimatePresence>{apiKey && <ApiKeyResult apiKey={apiKey} />}</AnimatePresence>
						</Card>
					</motion.div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
