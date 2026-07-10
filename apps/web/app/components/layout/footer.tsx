import Link from "next/link";

export default function Footer() {
	return (
		<footer className="w-full py-12 px-4 md:px-12 border-t border-white/10 bg-neutral mt-24">
			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
				<div className="flex flex-col gap-2">
					<span className="font-headline text-xl font-bold tracking-tighter text-white">DStats</span>
					<p className="text-sm font-mono text-neutral-500">© 2026 DStats. Built for developers.</p>
				</div>
				<div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end">
					<Link
						href="/privacy"
						className="text-sm font-mono text-neutral-500 hover:text-[#7F7EFF] transition-colors"
					>
						Privacy Policy
					</Link>
					<Link
						href="/terms"
						className="text-sm font-mono text-neutral-500 hover:text-[#7F7EFF] transition-colors"
					>
						Terms of Service
					</Link>
					<Link
						href="/discord"
						className="text-sm font-mono text-neutral-500 hover:text-[#7F7EFF] transition-colors"
					>
						Discord
					</Link>
					<Link
						href="/status"
						className="text-sm font-mono text-neutral-500 hover:text-[#7F7EFF] transition-colors"
					>
						Status
					</Link>
				</div>
			</div>
		</footer>
	);
}
