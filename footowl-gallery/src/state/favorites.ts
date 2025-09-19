import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FavoritesState = {
    favorites: Record<string, boolean>;
    toggleFavorite: (id: string) => void;
    // Back-compat alias for older code paths
    toggleFavorites?: (id: string) => void;
    isFavorite: (id:string) => boolean;
    loadFavorites: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: {},
            toggleFavorite: (id: string) => {
                const favoritesCopy: Record<string, boolean> = { ...get().favorites };
                if (favoritesCopy[id]) {
                    delete favoritesCopy[id];
                } else {
                    favoritesCopy[id] = true;
                }
                set({ favorites: favoritesCopy });
            },
            // Alias method to support legacy calls
            toggleFavorites: (id: string) => {
                const fn = (get() as FavoritesState).toggleFavorite;
                if (typeof fn === 'function') fn(id);
            },
            isFavorite: (id: string) => !!get().favorites[id],
            loadFavorites: () => { /* persisted store rehydrates automatically; keep for API compatibility */ },
        }),
        {
            name: 'fotoowl-favs',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);