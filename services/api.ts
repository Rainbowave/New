
import { cacheService } from './cacheService';
import { db } from './db';
import { authService } from './authService';

const API_BASE = process.env.REACT_APP_API_URL || '/api/v1';

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

interface PaginatedResponse<T> {
    items: T[];
    nextCursor?: string;
}

const getMockData = (endpoint: string): any => {
    const [pathString, queryString] = endpoint.split('?');
    const params = new URLSearchParams(queryString);
    const limit = parseInt(params.get('limit') || '10'); 
    const cursor = parseInt(params.get('cursor') || '0');
    const timelineType = params.get('type') || 'All';
    const tagFilter = params.get('tag'); 
    const sectionFilter = params.get('section');
    
    // --- CONTENT FILTERING LOGIC ---
    const user = authService.getCurrentUser();
    // Default to 'dating' (SFW) if no user or no preference
    const preference = user?.contentPreference || 'dating';
    const userRegion = user?.region; // Might be undefined or 'Global' or 'English (US)'

    // 'naughty' in UI maps to 'adult' logic here. 'dating' maps to safe content.
    const requireAdult = preference === 'adult';

    let data: any = null;

    if (pathString === '/trends/hashtags') {
        data = [
            { id: '1', tag: '#CyberpunkArt', count: '4.2M', trend: 'up' },
            { id: '2', tag: '#LuciSinLive', count: '1.8M', trend: 'up' },
            { id: '3', tag: '#CookingWithMarco', count: '850K', trend: 'up' },
            { id: '4', tag: '#DriftKings', count: '500K', trend: 'stable' },
            { id: '5', tag: '#Web3Dev', count: '320K', trend: 'down' },
        ];
    }
    // New Endpoint for Section-Specific Trending Interests
    else if (pathString === '/trends/tags') {
        const section = sectionFilter || 'general';
        const baseTags: Record<string, string[]> = {
            photos: ['Portrait', 'Cyberpunk', 'Neon', 'B&W', 'Nature', 'Urban', 'Macro', 'Fashion', 'Editorial', 'Film'],
            videos: ['Vlog', 'Gaming', 'Tech', 'Music', 'Cinema', 'React', 'Sports', 'Education', 'Comedy', 'ASMR'],
            comics: ['Manga', 'Webtoon', 'Superhero', 'Noir', 'Fantasy', 'Sci-Fi', 'Slice of Life', 'Horror', 'Action', 'Indie'],
            collection: ['Assets', 'Merch', 'Tools', 'Art', 'Music', '3D Models', 'Software', 'Services', 'Presets', 'Tutorials'],
            knowledge: ['Design', 'Growth', 'Tech', 'Business', 'Inspiration', 'Events', 'Community', 'Tutorials', 'Safety', 'Marketing']
        };

        const selectedTags = baseTags[section] || baseTags['photos'];
        
        data = selectedTags.map((tag, i) => ({
            id: `tag_${section}_${i}`,
            tag: tag,
            count: Math.floor(Math.random() * 50000) + 1000,
            trend: Math.random() > 0.5 ? 'up' : 'stable',
            // Generate a deterministic random image for this tag
            image: `https://picsum.photos/600/400?random=${section}_${i}_${tag}` 
        }));
    }
    else if (pathString === '/posts/draft') {
        data = JSON.parse(localStorage.getItem('cv_post_draft') || 'null');
    }
    else if (pathString === '/notifications') {
        data = db.getNotifications();
    }
    else if (pathString === '/leaderboard') {
        // Leaderboard logic remains mostly static for mock
        const generateLeaderboard = () => {
            const categories = ['Gaming', 'Tech', 'Art', 'Music', 'Lifestyle'];
            return Array.from({ length: 150 }).map((_, i) => ({
                id: `lb_user_${i}`,
                rank: i + 1,
                name: i < 2 ? (i === 0 ? 'Creative Soul' : 'System Admin') : (i % 5 === 0 ? `Pride_User_${i}` : `LuciStar_${i + 1}`),
                handle: `@user_${i + 1}`,
                score: Math.floor(100000 * Math.pow(0.97, i)).toLocaleString(),
                followers: Math.floor(50000 * Math.pow(0.95, i)).toLocaleString(),
                avatar: `https://picsum.photos/100/100?random=lb${i}`,
                category: i % 5 === 0 ? 'Member' : categories[i % categories.length], 
                change: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'same',
                isVerified: i < 20 && i % 5 !== 0 
            }));
        };
        
        let allItems = cacheService.get<any[]>('leaderboard_full') || generateLeaderboard();
        if (!cacheService.get('leaderboard_full')) cacheService.set('leaderboard_full', allItems);

        const categoryParam = params.get('category');
        if (categoryParam && categoryParam !== 'All') {
            if (categoryParam === 'Users') {
                 allItems = allItems.filter((i: any) => i.category === 'Member');
            } else {
                 allItems = allItems.filter((i: any) => i.category === categoryParam);
            }
        }

        const startIndex = cursor;
        const endIndex = startIndex + limit;
        const items = allItems.slice(startIndex, endIndex);
        const nextCursor = endIndex < allItems.length ? String(endIndex) : undefined;
        
        data = { items, nextCursor };
    }
    else if (pathString === '/wallet') {
        data = db.getWallet('1001');
    }
    else if (pathString === '/chat/contacts') {
        data = db.getChatContacts();
    }
    else if (pathString === '/live') {
        // Filter streams based on isAdult flag
        data = db.getStreams().filter((s: any) => !!s.isAdult === requireAdult);
    }
    else if (pathString === '/products') {
        const products = db.getProducts().filter((p: any) => !!p.isAdult === requireAdult);
        data = db.injectContent(products, 'mega');
    }
    else if (pathString === '/comics') {
        const comics = db.getComics().filter((c: any) => !!c.isAdult === requireAdult);
        data = db.injectContent(comics, 'comicReader');
    }
    else if (pathString === '/photos') {
        const photos = db.getPhotos().filter((p: any) => !!p.isAdult === requireAdult);
        data = db.injectContent(photos, 'photos');
    }
    else if (pathString === '/shorts') {
        let rawShorts = db.getShorts().filter((s: any) => !!s.isAdult === requireAdult);
        const startIndex = cursor % (rawShorts.length || 1);
        let pagedShorts = rawShorts.slice(startIndex, startIndex + limit);
        const injectedShorts = db.injectContent(pagedShorts, 'shorts');
        data = { items: injectedShorts, nextCursor: String(cursor + limit) };
    }
    else if (pathString.match(/\/users\/([^/]+)\/posts/)) {
        const userMatch = pathString.match(/\/users\/([^/]+)\/posts/);
        let userPosts = userMatch ? db.getUserPosts(userMatch[1]) : [];
        data = userPosts.filter((p: any) => !!p.isAdult === requireAdult);
    }
    else if (pathString.match(/\/users\/([^/?]+)/)) {
        const userMatch = pathString.match(/\/users\/([^/?]+)/);
        if (userMatch) {
            const username = userMatch[1];
            const existing = db.getUser(username);
            data = existing || {
                id: `u_${username}`, username: username, displayName: username,
                avatarUrl: `https://picsum.photos/200/200?random=${username}`,
                isVerified: true, followers: Math.floor(Math.random() * 100000),
                isPremium: true, isLuciStar: true, walletBalance: 1250,
                contentPreference: 'dating'
            };
        }
    }
    else if (pathString.match(/\/posts\/(\d+)\/comments/)) {
        const match = pathString.match(/\/posts\/(\d+)\/comments/);
        data = match ? db.getComments(match[1]) : [];
    }
    else if (pathString === '/feed') {
        // Main Feed Filtering
        let rawPosts = db.getPosts().filter((p: any) => !!p.isAdult === requireAdult);
        
        // REGION FILTERING (Mock Logic)
        // If user has a region and it's not global, prioritize or filter content
        if (userRegion && userRegion !== 'English (US)' && userRegion !== 'Global') {
             // For mock purposes, let's filter to show content that "matches" the region.
             // In a real DB, posts would have a `region` field. 
             // Here we simulate by filtering IDs modulo, just to show filtering works.
             // Or, we just label some mock data as regional.
             // rawPosts = rawPosts.filter((p: any) => p.region === userRegion || p.region === 'Global');
             
             // SIMULATION: If specific region selected, only show a subset to simulate "Regional Content"
             // This reduces the feed size for demonstration.
             // rawPosts = rawPosts.filter((_, i) => i % 2 === 0); 
        }

        // If "All" or generic view, ensure diversity of types for the homepage demo
        if (timelineType === 'All' && !tagFilter && rawPosts.length < 10) {
             const demoItems = [
                {
                    id: 8001, type: 'PHOTO', title: 'Cyberpunk Vision', content: 'Neon lights and rainy nights.',
                    thumbnailUrl: 'https://picsum.photos/600/800?random=photo1',
                    user: { username: 'ArtBot', avatar: 'https://picsum.photos/50/50?random=1', displayName: 'Art Bot' },
                    heat: 420, comments: 12, timestamp: Date.now(), isAdult: false
                },
                {
                    id: 8002, type: 'VIDEO', title: 'Vlog: Day in Life', content: 'Follow me around Tokyo.',
                    thumbnailUrl: 'https://picsum.photos/800/450?random=video1',
                    user: { username: 'Vlogger', avatar: 'https://picsum.photos/50/50?random=2', displayName: 'Traveler' },
                    heat: 1500, comments: 45, timestamp: Date.now() - 10000, isAdult: false
                },
                {
                    id: 8003, type: 'SHORT', title: 'Quick Tip!', content: 'How to draw hands in 30s.',
                    thumbnailUrl: 'https://picsum.photos/400/700?random=short1',
                    user: { username: 'DrawFast', avatar: 'https://picsum.photos/50/50?random=3', displayName: 'Sketchy' },
                    heat: 800, comments: 30, timestamp: Date.now() - 20000, isAdult: false
                },
                {
                    id: 8004, type: 'COMIC', title: 'The Void: Chapter 1', content: 'Start reading the new series now!',
                    thumbnailUrl: 'https://picsum.photos/400/600?random=comic1',
                    user: { username: 'InkMaster', avatar: 'https://picsum.photos/50/50?random=4', displayName: 'Inker' },
                    heat: 2200, comments: 150, timestamp: Date.now() - 30000, isAdult: false
                },
                {
                    id: 8005, type: 'COLLECTION', title: 'Pro Asset Pack', content: 'High quality textures for 3D artists.',
                    thumbnailUrl: 'https://picsum.photos/600/600?random=coll1',
                    user: { username: 'AssetStore', avatar: 'https://picsum.photos/50/50?random=5', displayName: 'Assets' },
                    heat: 120, comments: 5, price: '25.00', timestamp: Date.now() - 40000, isAdult: false
                },
                {
                    id: 8006, type: 'RESOURCE', title: 'Monetization Guide 2025', content: 'Learn how to maximize your earnings on LuciSin.',
                    thumbnailUrl: 'https://picsum.photos/800/400?random=res1',
                    user: { username: 'LuciGuide', avatar: 'https://picsum.photos/50/50?random=6', displayName: 'Guide' },
                    heat: 5000, comments: 200, category: 'Growth', timestamp: Date.now() - 50000, isAdult: false
                },
                {
                    id: 8007, type: 'POLL', title: 'Community Vote', content: 'Next Content?', 
                    pollData: {
                        question: 'What should I draw next?',
                        options: [{id: '1', label: 'Dragon', votes: 45}, {id: '2', label: 'Robot', votes: 30}],
                        type: 'standard'
                    },
                    user: { username: 'Poller', avatar: 'https://picsum.photos/50/50?random=7', displayName: 'Asker' },
                    heat: 100, comments: 20, timestamp: Date.now() - 60000, isAdult: false
                },
                {
                    id: 8008, type: 'POLL', title: 'Prize Draw', content: 'Ticket Pool Entry',
                    pollData: {
                        question: 'Win 500 LSC!',
                        options: [{id: '1', label: 'Enter Draw', votes: 120}],
                        type: 'ticket_pool',
                        ticketPrice: '50'
                    },
                    user: { username: 'Giveaway', avatar: 'https://picsum.photos/50/50?random=8', displayName: 'Lotto' },
                    heat: 300, comments: 80, timestamp: Date.now() - 70000, isAdult: false
                }
             ];
             
             // Filter mock items if we are in adult mode
             const filteredMocks = demoItems.filter(p => !requireAdult || p.isAdult === requireAdult);
             rawPosts = [...rawPosts, ...filteredMocks];
        }

        if (tagFilter) {
            const lowerTag = tagFilter.toLowerCase().replace('#', '');
            rawPosts = rawPosts.filter((p: any) => 
                p.title.toLowerCase().includes(lowerTag) || 
                (p.category && p.category.toLowerCase().includes(lowerTag)) ||
                (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(lowerTag)))
            );
        } else if (timelineType === 'Pride') {
            rawPosts = rawPosts.filter((p: any) => p.isPride === true);
        } else if (timelineType === 'Stars') {
            rawPosts = rawPosts.filter((p: any) => p.userId === '1001' || p.userId === '1002');
        } else if (timelineType === 'Trending') {
            rawPosts = rawPosts.filter((p: any) => (p.heat > 500) || p.isTrending === true);
        }

        const pagedPosts = rawPosts.slice(cursor, cursor + limit);
        const injectedPosts = db.injectContent(pagedPosts, 'homeFeed');

        data = { items: injectedPosts, nextCursor: String(cursor + limit) };
    }

    if (data && !endpoint.includes('cursor')) cacheService.set(endpoint, data);
    return data;
};

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = localStorage.getItem('cv_token');
    
    if (endpoint === '/posts/draft') {
        if (options.method === 'POST') {
            localStorage.setItem('cv_post_draft', options.body as string);
            return JSON.parse(options.body as string);
        }
        if (options.method === 'DELETE') {
            localStorage.removeItem('cv_post_draft');
            return { success: true } as unknown as T;
        }
    }

    if (endpoint === '/payments/create-session' && options.method === 'POST') {
        const body = JSON.parse(options.body as string);
        return { 
            success: true, 
            sessionId: 'cs_live_' + Math.random().toString(36).substr(2, 9),
            url: 'https://checkout.stripe.com/pay/' + Math.random().toString(36).substr(2, 9)
        } as unknown as T;
    }

    if (endpoint === '/posts' && options.method === 'POST') {
        const body = JSON.parse(options.body as string);
        const currentUser = authService.getCurrentUser();
        if (body.isAdult === undefined && currentUser?.contentPreference) {
             body.isAdult = currentUser.contentPreference === 'adult';
        }
        return db.createPost(body) as unknown as T;
    }

    if (endpoint.match(/\/posts\/(\d+)\/comments/) && options.method === 'POST') {
        const match = endpoint.match(/\/posts\/(\d+)\/comments/);
        const body = JSON.parse(options.body as string);
        const newComment = { id: Date.now(), user: 'creativesoul', text: body.text, time: 'Just now' };
        if (match) db.addComment(match[1], newComment);
        return newComment as unknown as T;
    }

    if (endpoint === '/wallet/update' && options.method === 'POST') {
        const body = JSON.parse(options.body as string);
        return { success: true, newBalance: db.updateWallet('1001', body.amount) } as unknown as T;
    }

    if (endpoint === '/transactions/tip' && options.method === 'POST') {
        const body = JSON.parse(options.body as string);
        db.updateWallet('1001', -body.amount);
        return { success: true } as unknown as T;
    }

    if (options.method === 'POST') {
        const likeMatch = endpoint.match(/\/posts\/(\d+)\/like/);
        if (likeMatch) return { liked: db.toggleLike(parseInt(likeMatch[1])) } as unknown as T;
    }

    if ((options.method === 'GET' || !options.method) && !endpoint.includes('cursor')) {
        const cached = cacheService.get<T>(endpoint);
        if (cached) return cached;
    }

    await new Promise(r => setTimeout(r, 400));
    return getMockData(endpoint) as unknown as T;
};

export const api = {
    request,
    get<T>(endpoint: string) { return request<T>(endpoint, { method: 'GET' }); },
    post<T>(endpoint: string, body: any) { return request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
    patch<T>(endpoint: string, body: any) { return request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }); },
    delete<T>(endpoint: string) { return request<T>(endpoint, { method: 'DELETE' }); }
};
