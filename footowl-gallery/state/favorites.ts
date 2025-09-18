import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FavoritesState = {
    favorites: Record<string, boolean>;
    toggleFavorites: (id:string) => void;
    loadFavorites: () => Promise<void>;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
    favorites: {},

    toggleFavorites: async (id) => {
        const favs = {...get().favorites, [id]: !get().favorites[id]};
        set({ favorites: favs });
        await AsyncStorage.setItem("favorites", JSON.stringify(favs));
    },

    loadFavorites: async () =>{
        const stored = await AsyncStorage.getItem("favorites");
        if(stored) set({ favorites: JSON.parse(stored) });
    },
}));