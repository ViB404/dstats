export interface RegisterPayload {
	hcaptcha_token: string;
	client_id: string;
	owner_id: string | null;
}

export interface RegisterResponse {
	success: boolean;
	message?: string;
	data: {
		api_key: string;
	};
}
