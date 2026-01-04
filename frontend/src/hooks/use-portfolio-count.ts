import { useGetPortfolioQuery } from "@/lib/api";

/**
 * Custom hook to get the dynamic count of portfolio projects site-wide.
 * Returns { count, isLoading, isError }
 */
export function usePortfolioCount() {
  const { data, isLoading, isError } = useGetPortfolioQuery();
  const count = data?.items?.length ?? 0;
  return { count, isLoading, isError };
}

