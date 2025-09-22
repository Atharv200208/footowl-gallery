import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEY = "imageCache";
const MAX_ITEMS = 100;

export async function saveToCache(newItems:any) {
    try {
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        let cache: any[] = raw ? JSON.parse(raw) : [];

        const merged = [...newItems, ...cache].reduce((acc, item) => {
            if(!acc.find((i:any) => i.id === item.id)) acc.push(item);
            return acc;
        }, [] as any[])

        const trimmed = merged.slice(0, MAX_ITEMS);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
    } catch (error) {
        console.warn('Failed to save cache', error);
    }
}

export async function loadFromCache(): Promise<any[]> {
    try {
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        return raw ? JSON.parse(raw) : []; 
    } catch (error) {
        console.warn('Failed to load cache', error);
        return [];
    }
}

export async function clearCache() {
    await AsyncStorage.removeItem(CACHE_KEY);
}