export default function ComingSoonPage() {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
			<div className="absolute inset-0 -z-10">
				<div className="absolute left-1/2 top-1/2 h-140 w-140 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[180px]" />
			</div>

			<div className="max-w-2xl text-center">
				<span className="mb-6 inline-flex rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
					🚧 Under Development
				</span>

				<h1 className="font-heading text-6xl font-bold tracking-tight md:text-8xl">
					Coming <span className="text-(--color-primary)">Soon</span>
				</h1>

				<p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
					This page isn't ready yet, but it won't stay empty for long.
				</p>

				<p className="mt-10 font-label text-xs uppercase tracking-[0.35em] text-muted-foreground">
					Good things take time :)
				</p>
			</div>
		</main>
	);
}
