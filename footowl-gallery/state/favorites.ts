import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageItem } from "../src/services/images";

type FavoritesState = {
  favorites: Record<string, ImageItem>;          // now store full objects
  toggleFavorite: (item: ImageItem) => void;     // pass the whole item
  loadFavorites: () => Promise<void>;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: {},

  toggleFavorite: async (item) => {
    const favs = { ...get().favorites };

    if (favs[item.id]) {
      // already a favorite → remove
      delete favs[item.id];
    } else {
      // not a favorite → add full object
      favs[item.id] = item;
    }

    set({ favorites: favs });
    await AsyncStorage.setItem("favorites", JSON.stringify(favs));
  },

  loadFavorites: async () => {
    const stored = await AsyncStorage.getItem("favorites");
    if (stored) {
      set({ favorites: JSON.parse(stored) });
    }
  },
}));