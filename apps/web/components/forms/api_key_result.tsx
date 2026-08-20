import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ApiKeyResultProps {
	apiKey: string;
}

export function ApiKeyResult({ apiKey }: ApiKeyResultProps) {
	const router = useRouter();
	const [isCopied, setIsCopied] = useState(false);
	const [hasCopiedOnce, setHasCopiedOnce] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(apiKey);
		setIsCopied(true);
		setHasCopiedOnce(true);
		toast.success("API Key copied to clipboard!");
		setTimeout(() => setIsCopied(false), 2000);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 15, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			className="mt-2 flex w-full flex-col gap-4 border-t border-border pt-6"
		>
			<p className="text-left font-label text-xs font-semibold uppercase tracking-widest text-(--color-primary)">
				Production API Key
			</p>
			<div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-3 group hover:border-primary/60 transition-colors">
				<code className="truncate font-label text-sm text-foreground ml-2">{apiKey}</code>
				<button
					onClick={handleCopy}
					className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary/20 hover:text-foreground transition-all active:scale-95"
				>
					{isCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
				</button>
			</div>
			<p className="text-xs text-muted-foreground text-left">
				* Store this key securely. You won&apos;t be able to see it again.
			</p>

			<AnimatePresence>
				{hasCopiedOnce && (
					<motion.div
						initial={{ opacity: 0, y: 10, height: 0 }}
						animate={{ opacity: 1, y: 0, height: "auto" }}
						exit={{ opacity: 0, y: -10, height: 0 }}
						transition={{ duration: 0.25 }}
						className="w-full pt-2"
					>
						<Button
							onClick={() => router.push("/dashboard")}
							className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
						>
							<LayoutDashboard className="h-4 w-4" />
							Go to Dashboard
							<ArrowRight className="h-4 w-4" />
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
