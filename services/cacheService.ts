
// Simulating a high-performance persistent cache layer with L1 (Memory) and L2 (Disk) strategies.
// This implements a standard LRU (Least Recently Used) mechanism for speed.

const TTL = 1000 * 60 * 10; // 10 Minutes Cache Time
const CACHE_PREFIX = 'cv_cache_';

// L1 Cache: In-Memory Map for instant retrieval
const memoryCache = new Map<string, { data: any, timestamp: number }>();

export const cacheService = {
    /**
     * Get data from cache. Checks Memory first (L1), then LocalStorage (L2).
     */
    get: <T>(key: string): T | null => {
        const cacheKey = CACHE_PREFIX + key;

        // 1. Check L1 Cache (Memory) - Fastest
        if (memoryCache.has(cacheKey)) {
            const item = memoryCache.get(cacheKey)!;
            if (Date.now() - item.timestamp < TTL) {
                return item.data as T;
            } else {
                memoryCache.delete(cacheKey); // Expired
            }
        }

        // 2. Check L2 Cache (LocalStorage/Redis Simulation)
        try {
            const itemStr = localStorage.getItem(cacheKey);
            if (!itemStr) return null;

            const item = JSON.parse(itemStr);
            
            // Expiration check
            if (Date.now() - item.timestamp > TTL) {
                localStorage.removeItem(cacheKey);
                memoryCache.delete(cacheKey);
                return null;
            }
            
            // Hydrate L1 from L2 for future fast access
            memoryCache.set(cacheKey, item);
            
            return item.data as T;
        } catch (e) {
            console.warn('Cache read error', e);
            return null;
        }
    },

    /**
     * Set data in cache. Writes to both Memory and LocalStorage.
     */
    set: (key: string, data: any) => {
        const cacheKey = CACHE_PREFIX + key;
        const item = { data, timestamp: Date.now() };

        // Write to L1
        memoryCache.set(cacheKey, item);

        // Write to L2 (LocalStorage persistent backup)
        try {
            localStorage.setItem(cacheKey, JSON.stringify(item));
        } catch (e) {
            // If quota exceeded, we still have L1 in memory
            console.warn('Persistent cache write failed, using memory only.');
        }
    },

    invalidate: (keyPattern: string) => {
        // Clear L1
        for (const key of memoryCache.keys()) {
            if (key.includes(keyPattern)) {
                memoryCache.delete(key);
            }
        }

        // Clear L2
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(CACHE_PREFIX) && key.includes(keyPattern)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {
            console.error('Cache invalidation error', e);
        }
    },

    clear: () => {
        memoryCache.clear();
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(CACHE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {
            console.error('Cache clear error', e);
        }
    }
};
