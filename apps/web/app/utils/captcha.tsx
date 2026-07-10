"use client";

import { useRef, useState, SyntheticEvent } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function SecureForm() {
	const [token, setToken] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const captchaRef = useRef<HCaptcha>(null);

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();

		if (!token) {
			captchaRef.current?.execute();
			return;
		}

		setIsSubmitting(true);

		try {
			console.log(`Sending token to backend: ${token}`);

			captchaRef.current?.resetCaptcha();
			setToken(null);
		} catch (error) {
			console.error("Submission failed", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<HCaptcha
				sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
				onVerify={token => setToken(token)}
				ref={captchaRef}
			/>

			<button
				type="submit"
				disabled={isSubmitting}
				className="px-4 py-2 bg-[#7F7EFF] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
			>
				{isSubmitting ? "Processing..." : "Submit Form"}
			</button>
		</form>
	);
}
