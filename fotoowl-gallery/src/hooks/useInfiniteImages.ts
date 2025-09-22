
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchImages, ImageItem } from '../services/images';

type UseInfiniteImagesOpts = {
  pageSize?: number;
  orderBy?: number | string;
  orderAsc?: boolean;
};

export function useInfiniteImages({ pageSize = 40, orderBy = 2, orderAsc = true }: UseInfiniteImagesOpts = {}) {
  return useInfiniteQuery({
    queryKey: ['images-infinite', pageSize, orderBy, orderAsc],
    queryFn: async ({ pageParam = 0, signal }) => {
      // pageParam defaults to 0 for the first page (FotoOwl uses page=0)
      const res = await fetchImages({ page: pageParam, pageSize, orderBy, orderAsc }, signal as AbortSignal | undefined);
      return res; // { items, page }
    },
    getNextPageParam: (lastPage, allPages) => {
      // If lastPage.items length < pageSize, we've hit the end
      if (!lastPage?.items || lastPage.items.length < pageSize) return undefined;
      // FotoOwl is zero-based pages: next = last.page + 1
      return lastPage.page + 1;
    },
    keepPreviousData: false, // infinite query handles incremental data
    staleTime: 1000 * 30,
  });
}
