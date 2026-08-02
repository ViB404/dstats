const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch<T>(path: string, apiKey: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, {
		...init,
		headers: {
			"x-api-key": apiKey,
			...(init?.headers ?? {}),
		},
	});

	const json = await response.json();

	if (!response.ok) {
		throw new Error(json.message ?? "Request failed.");
	}

	return json.data as T;
}
