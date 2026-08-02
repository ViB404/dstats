"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type QueryProviderProps = {
	children: ReactNode;
};

export default function QueryProvider({ children }: QueryProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1,
						staleTime: 1000 * 60 * 5,
						gcTime: 1000 * 60 * 10,
						refetchOnWindowFocus: false,
						refetchOnReconnect: true,
						refetchOnMount: true,
						networkMode: "online",
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}

			{process.env.NODE_ENV === "development" && (
				<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
			)}
		</QueryClientProvider>
	);
}
