// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import { fetchImages, ImageItem } from "../services/images";

// type UseImagesParams = {
//   page?: number;
//   pageSize?: number;
//   orderBy?: string;
//   orderAsc?: boolean;
// };

// export function useImages({
//   page = 1,
//   pageSize = 20,
//   orderBy = "created_at",
//   orderAsc = false,
// }: UseImagesParams) {
//   return useQuery({
//     queryKey: ["images", page, pageSize, orderBy, orderAsc],
//     queryFn: async ({ signal }) => {
//       const res = await fetchImages(
//         { page, pageSize, orderBy, orderAsc },
//         signal as AbortSignal | undefined
//       );
//       return res as { items: ImageItem[]; page: number };
//     },
//     placeholderData: keepPreviousData, // ✅ replaces keepPreviousData: true
//     staleTime: 1000 * 60,
//   });
// }
