"use client";

import { useRouter } from "next/navigation";
import { Button, Dialog } from "@base-ui/react";
import { Loader2 } from "lucide-react";

type ApiKeyModalProps = {
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
	inputKey: string;
	onInputKeyChangeAction: (value: string) => void;
	onSaveAction: () => void;
	isSaving: boolean;
};

export default function ApiKeyModal({
	open,
	onOpenChangeAction,
	inputKey,
	onInputKeyChangeAction,
	onSaveAction,
	isSaving,
}: ApiKeyModalProps) {
	const router = useRouter();

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChangeAction}>
			<Dialog.Portal>
				<Dialog.Backdrop className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
				<Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#121212] border border-white/10 p-8 rounded-2xl shadow-2xl">
					<h2 className="text-2xl font-bold text-white mb-6">Enter API Key</h2>
					<input
						type="password"
						className="w-full bg-neutral-900 border border-white/10 rounded-lg p-4 text-white mb-6 focus:ring-2 focus:ring-[#7F7EFF] focus:border-transparent outline-none transition-all"
						placeholder="ds_live_..."
						value={inputKey}
						onChange={e => onInputKeyChangeAction(e.target.value)}
						onKeyDown={e => {
							if (e.key === "Enter") {
								onSaveAction();
							}
						}}
						autoFocus
						spellCheck={false}
						autoComplete="off"
					/>
					<div className="flex flex-col gap-3">
						<Button
							onClick={onSaveAction}
							disabled={isSaving}
							className="w-full h-12 bg-[#7F7EFF] hover:bg-[#7F7EFF]/90 text-white font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
						>
							{isSaving ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Connecting...
								</>
							) : (
								"Connect API Key"
							)}
						</Button>
						<Button
							onClick={() => router.push("/dashboard/api-keys")}
							className="w-full h-12 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
						>
							Don&apos;t have a key? Generate one
						</Button>
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
