"use client";

import Link from "next/link";
import { Menu, X, Loader2 } from "lucide-react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Dialog } from "@base-ui/react";

export default function Navbar() {
	const { isLoaded, isSignedIn } = useAuth();

	const links = [
		{ name: "Docs", href: "/docs" },
		{ name: "GitHub", href: "https://www.github.com/vib404/dstats" },
		{ name: "Dashboard", href: "/dashboard" },
	];

	return (
		<nav className="fixed top-0 w-full z-50 bg-neutral/80 backdrop-blur-xl border-b border-white/10 shadow-sm h-20 flex items-center">
			<div className="flex items-center justify-between px-4 md:px-12 h-full mx-auto w-full">
				<Link href="/" className="font-headline text-2xl font-bold tracking-tighter text-white">
					DStats
				</Link>

				<div className="hidden md:flex items-center gap-8">
					{links.map(link => (
						<Link
							key={link.name}
							href={link.href}
							className="text-neutral-400 hover:text-white transition-colors text-sm font-medium"
						>
							{link.name}
						</Link>
					))}
				</div>

				<div className="flex items-center gap-4">
					<div className="hidden md:flex items-center min-w-22.5 justify-end">
						{!isLoaded ? (
							<Loader2 className="w-5 h-5 text-neutral-500 animate-spin" />
						) : !isSignedIn ? (
							<SignInButton mode="modal">
								<button className="px-4 py-2 rounded-lg font-medium bg-linear-to-br from-[#7F7EFF] to-[#A390E4] hover:opacity-90 text-white transition-opacity">
									Sign In
								</button>
							</SignInButton>
						) : (
							<UserButton
								appearance={{
									elements: {
										userButtonAvatarBox: "w-9 h-9 border border-white/10",
									},
								}}
							/>
						)}
					</div>

					<Dialog.Root>
						<Dialog.Trigger className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer">
							<Menu className="h-6 w-6" />
						</Dialog.Trigger>

						<Dialog.Portal>
							<Dialog.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" />

							<Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex h-full w-3/4 max-w-sm flex-col gap-6 border-l border-white/10 bg-neutral/95 backdrop-blur-2xl p-6 shadow-2xl outline-none transition-transform origin-right data-starting-style:translate-x-full data-ending-style:translate-x-full">
								<div className="flex justify-end">
									<Dialog.Close className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer">
										<X className="h-6 w-6" />
									</Dialog.Close>
								</div>

								<div className="flex flex-col gap-6 mt-4">
									{links.map(link => (
										<Link
											key={link.name}
											href={link.href}
											className="text-lg font-medium text-neutral-200 hover:text-tertiary transition-colors"
										>
											{link.name}
										</Link>
									))}

									<div className="mt-4 pt-4 border-t border-white/10">
										{!isLoaded ? (
											<div className="w-full flex justify-center py-3">
												<Loader2 className="w-5 h-5 text-neutral-500 animate-spin" />
											</div>
										) : !isSignedIn ? (
											<SignInButton mode="modal">
												<button className="w-full px-4 py-3 rounded-lg font-medium bg-linear-to-br from-[#7F7EFF] to-[#A390E4] text-white">
													Sign In
												</button>
											</SignInButton>
										) : (
											<div className="flex items-center gap-4 p-2 rounded-lg bg-white/5 border border-white/10">
												<UserButton />
												<span className="text-sm font-medium text-neutral-200">
													Manage Account
												</span>
											</div>
										)}
									</div>
								</div>
							</Dialog.Popup>
						</Dialog.Portal>
					</Dialog.Root>
				</div>
			</div>
		</nav>
	);
}
