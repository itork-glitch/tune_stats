import useSWR from 'swr';

const fetcher = (url: string, token: string) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => {
    if (!res.ok) throw new Error('Spotify API error');
    return res.json();
  });

export function useTopItems<T>(endpoint: string, token: string | null) {
  const shouldFetch = Boolean(token);
  const { data, error } = useSWR(
    shouldFetch ? [endpoint, token] : null,
    ([url, t]) =>
      t ? fetcher(url, t) : Promise.reject(new Error('Token is null'))
  );

  return {
    items: (data?.items ?? []) as T[],
    loading: shouldFetch && !error && !data,
    error,
  };
}
