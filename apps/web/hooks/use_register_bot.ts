import { useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { toast } from "sonner";
import { RegisterPayload, RegisterResponse } from "@/types/auth";

export function useRegisterBot() {
	const [isGenerating, setIsGenerating] = useState(false);
	const [apiKey, setApiKey] = useState<string | null>(null);
	const [captchaToken, setCaptchaToken] = useState<string | null>(null);
	const [clientId, setClientId] = useState("");
	const [ownerId, setOwnerId] = useState("");
	const captchaRef = useRef<HCaptcha>(null);

	const isFormValid = clientId.trim() !== "" && captchaToken !== null;

	const resetCaptcha = () => {
		captchaRef.current?.resetCaptcha();
		setCaptchaToken(null);
	};

	const generateKey = async () => {
		if (!isFormValid || isGenerating || apiKey) return;
		setIsGenerating(true);

		const toastId = toast.loading("Processing your payload...");

		try {
			const payload: RegisterPayload = {
				hcaptcha_token: captchaToken,
				client_id: clientId.trim(),
				owner_id: ownerId.trim() || null,
			};

			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data: RegisterResponse = await response.json();

			if (!response.ok || !data.success) {
				toast.error(data.message || "Backend rejected the payload.", {
					id: toastId,
					description: `Status Code: ${response.status}`,
				});
				resetCaptcha();
				return;
			}

			const key = data.data.api_key;
			setApiKey(key);
			localStorage.setItem("dstats_key", key);
			toast.success("Production API Key generated successfully!", { id: toastId });
		} catch {
			toast.error("A network or parsing error occurred.", { id: toastId });
			resetCaptcha();
		} finally {
			setIsGenerating(false);
		}
	};

	return {
		clientId,
		setClientId,
		ownerId,
		setOwnerId,
		captchaToken,
		setCaptchaToken,
		captchaRef,
		isFormValid,
		isGenerating,
		apiKey,
		generateKey,
	};
}
