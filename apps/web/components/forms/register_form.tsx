import { RefObject } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Fingerprint, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterFormProps {
	clientId: string;
	setClientId: (val: string) => void;
	ownerId: string;
	setOwnerId: (val: string) => void;
	onVerify: (token: string) => void;
	onExpire: () => void;
	captchaRef: RefObject<HCaptcha | null>;
}

export function RegisterForm({
	clientId,
	setClientId,
	ownerId,
	setOwnerId,
	onVerify,
	onExpire,
	captchaRef,
}: RegisterFormProps) {
	return (
		<div className="w-full flex flex-col gap-5">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
				<div className="space-y-2">
					<Label
						htmlFor="clientId"
						className="text-muted-foreground font-label text-xs uppercase tracking-wider flex items-center gap-1"
					>
						<Fingerprint className="w-3 h-3" /> Client ID *
					</Label>
					<Input
						id="clientId"
						type="text"
						inputMode="numeric"
						placeholder="e.g. 1048291..."
						value={clientId}
						onChange={e => setClientId(e.target.value)}
						className="bg-muted/50 border-border text-foreground focus-visible:ring-primary/50 font-label"
					/>
				</div>

				<div className="space-y-2">
					<Label
						htmlFor="ownerId"
						className="text-muted-foreground font-label text-xs uppercase tracking-wider flex items-center gap-1"
					>
						<User className="w-3 h-3" /> Owner ID (Optional)
					</Label>
					<Input
						id="ownerId"
						type="text"
						inputMode="numeric"
						placeholder="Your Discord ID"
						value={ownerId}
						onChange={e => setOwnerId(e.target.value)}
						className="bg-muted/50 border-border text-foreground focus-visible:ring-primary/50 font-label"
					/>
				</div>
			</div>

			<div className="mt-2 flex w-full justify-center">
				<HCaptcha
					sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || ""}
					onVerify={onVerify}
					onExpire={onExpire}
					theme="dark"
					ref={captchaRef}
				/>
			</div>
		</div>
	);
}
