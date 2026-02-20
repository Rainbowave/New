
import { useState, useEffect, useCallback, RefObject, useRef } from 'react';

export function useInfiniteScroll<T>(
  fetchData: (cursor?: string) => Promise<{ items: T[], nextCursor?: string }>,
  targetRef?: RefObject<HTMLElement | null>,
  threshold: number = 300
) {
  const [data, setData] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Use ref to track loading state in closures (event listeners)
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    
    setLoading(true);
    loadingRef.current = true;
    
    try {
      const { items, nextCursor } = await fetchData(cursor);
      
      if (items.length === 0 || !nextCursor) {
        setHasMore(false);
      } else {
        setCursor(nextCursor);
      }
      
      setData(prev => {
        // Prevent duplicates based on ID if T has an id property
        const newItems = items.filter(item => {
            const id = (item as any).id;
            return !prev.some(p => (p as any).id === id);
        });
        return [...prev, ...newItems];
      });
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [cursor, hasMore, fetchData]);

  const refresh = useCallback(async () => {
      if (loadingRef.current) return;
      
      setLoading(true);
      loadingRef.current = true;
      
      try {
          const { items, nextCursor } = await fetchData(undefined);
          setData(items);
          setCursor(nextCursor);
          setHasMore(!!nextCursor);
      } catch (error) {
          console.error("Refresh failed", error);
      } finally {
          setLoading(false);
          loadingRef.current = false;
      }
  }, [fetchData]);

  useEffect(() => {
    let target: HTMLElement | Window | null = targetRef?.current || null;
    
    // Auto-detect the main layout scroll container if no specific ref is passed
    if (!target) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) target = mainContent;
        else target = window;
    }

    const isWindow = target === window;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (loadingRef.current || !hasMore) {
            ticking = false;
            return;
          }

          let scrollTop = 0;
          let clientHeight = 0;
          let scrollHeight = 0;

          if (isWindow) {
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            clientHeight = window.innerHeight;
            scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
          } else {
            const el = target as HTMLElement;
            scrollTop = el.scrollTop;
            clientHeight = el.clientHeight;
            scrollHeight = el.scrollHeight;
          }

          // Trigger when within threshold of bottom
          if (scrollHeight - scrollTop - clientHeight < threshold) {
            loadMore();
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    target!.addEventListener('scroll', onScroll, { passive: true });
    return () => target!.removeEventListener('scroll', onScroll);
  }, [loadMore, hasMore, targetRef, threshold]); // Dependency array simplified

  // Initial load
  useEffect(() => {
      if (!cursor && data.length === 0) loadMore();
  }, []); // Only runs on mount

  // Function to prepend new items (e.g. from websocket)
  const addNewItems = useCallback((newItems: T[]) => {
      setData(prev => [...newItems, ...prev]);
  }, []);

  return { data, loading, hasMore, addNewItems, refresh };
}
