import { Sparkles, Key, Terminal } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Features() {
  return (
    <section className="py-24 px-4 md:px-12 max-w-7xl mx-auto w-full">
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="p-8 rounded-2xl bg-white/3 border-white/10 hover:bg-white/5 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-[#7F7EFF]/10 flex items-center justify-center border border-[#7F7EFF]/20 mb-6 group-hover:scale-110 transition-transform">
            <Sparkles className="text-[#7F7EFF] w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-4">Automatic Event Tracking</h3>
          <p className="text-neutral-400 leading-relaxed">Guild joins and guild leaves are detected automatically through the adapter. Zero configuration hooks.</p>
        </Card>

        <Card className="p-8 rounded-2xl bg-white/3 border-white/10 hover:bg-white/5 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center border border-tertiary/20 mb-6 group-hover:scale-110 transition-transform">
            <Key className="text-tertiary w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-4">API Key</h3>
          <p className="text-neutral-400 leading-relaxed">Generate a API key from your dashboard and start tracking bots instantly with unified data.</p>
        </Card>

        <Card className="p-8 rounded-2xl bg-white/3 border-white/10 hover:bg-white/5 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-[#A390E4]/10 flex items-center justify-center border border-[#A390E4]/20 mb-6 group-hover:scale-110 transition-transform">
            <Terminal className="text-[#A390E4] w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-4">Developer First</h3>
          <p className="text-neutral-400 leading-relaxed">Minimal setup, clean SDK, REST API, and excellent documentation. Future support for webhooks is built in.</p>
        </Card>
      </div>
    </section>
  );
}