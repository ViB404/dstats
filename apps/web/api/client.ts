const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public response?: Response
	) {
		super(message);
		this.name = "ApiError";
	}
}

export async function apiFetch<T>(path: string, apiKey: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, {
		...init,
		headers: {
			"x-api-key": apiKey,
			...(init?.headers ?? {}),
		},
	});

	let json = null;
	try {
		json = await response.json();
	} catch {
		console.error("Something went wrong!");
	}

	if (!response.ok) {
		throw new ApiError(json?.message ?? `Request failed with status ${response.status}`, response.status, response);
	}

	return json?.data as T;
}
