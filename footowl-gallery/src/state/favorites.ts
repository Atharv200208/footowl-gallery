import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoriteState = {
    favorites: Record<string, true>;
    toggle: (id: string) => void;
    isFav: (id:string) => boolean;
};

export const useFavorites = create<FavoriteState>()(
    persist(
        (set, get) => ({
            favorites: {},
            toggle: (id:string) => {
                const favs = { ...get().favorites };
                if(favs[id]) delete favs[id];
                else favs[id] delete favs[id];
                set({ favorites: favs });
            },
            isFav: (id: string) => !!get().favorites[id],
        }),
        {
            name: 'fotoowl-favs',
            getStorage: () => AsyncStorage,
        }
    )
);