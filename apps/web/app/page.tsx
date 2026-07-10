import HeroSection from "./components/sections/hero-section";
import Navbar from "./components/layout/navbar";
import CodePreview from "./components/sections/code-preview";
import Features from "./components/sections/features";
import Footer from "./components/layout/footer";

export default function Home() {
	return (
		<main className="min-h-screen bg-neutral text-primary">
			<Navbar />
			<div className="pt-20">
				<HeroSection />
				<CodePreview />
				<Features />
			</div>
			<Footer />
		</main>
	);
}
