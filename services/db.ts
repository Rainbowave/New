
import { UserRole } from '../types';

// Helper to generate full permissions for admin
const fullPerms = {
    view: true, create: true, edit: true, delete: true
};

const emptyPerms = {
    view: false, create: false, edit: false, delete: false
};

// Mock Data Store
const store = {
    users: [] as any[],
    posts: [] as any[],
    comments: [] as any[],
    notifications: [] as any[],
    wallet: { balance: 1250 } as any,
    transactions: [] as any[],
    gameHistory: [] as any[],
    promotions: [] as any[],
    contests: [] as any[],
    prideTags: [] as string[],
    
    // Moderation Data with Context
    reports: [
        { id: 101, type: 'Comment', reason: 'Spam', user: 'spammer_x', contentPreview: 'Buy cheap coins now!', status: 'pending', timestamp: new Date().toISOString(), priority: 'low', context: 'dating' },
        { id: 102, type: 'Message', reason: 'Harassment', user: 'troll_99', contentPreview: 'Unwanted messages', status: 'pending', timestamp: new Date().toISOString(), priority: 'high', context: 'dating' },
        { id: 103, type: 'Profile', reason: 'Bot Activity', user: 'bot_net', contentPreview: 'Profile link spam', status: 'pending', timestamp: new Date().toISOString(), priority: 'medium', context: 'adult' },
        { id: 104, type: 'Photo', reason: 'Nudity', user: 'explicit_user', contentPreview: 'Explicit content in public', status: 'pending', timestamp: new Date().toISOString(), priority: 'high', context: 'adult' }
    ] as any[],
    
    verificationRequests: [
        { id: 1, user: 'new_star_1', type: 'Identity', date: '10m ago', code: 'A123', context: 'dating' },
        { id: 2, user: 'gamer_pro', type: 'Creator', date: '1h ago', code: 'B456', context: 'dating' },
        { id: 3, user: 'adult_star_x', type: 'Identity', date: '2h ago', code: 'C789', context: 'adult' }
    ] as any[],
    
    logs: [
        { id: 501, targetId: 'bad_actor', action: 'suspend_user', details: 'Violation of terms', timestamp: Date.now() - 100000, context: 'dating' },
        { id: 502, targetId: 'rule_breaker', action: 'ban_user', details: 'Repeat offender', timestamp: Date.now() - 500000, context: 'adult' },
        { id: 503, targetId: 'spammer_01', action: 'warn_user', details: 'Spamming comments', timestamp: Date.now() - 20000, context: 'dating' }
    ] as any[],

    pendingApprovals: [
        { id: 1, user: 'creator_wannabe', type: 'Creator Access', date: '2h ago', notes: 'Portfolio attached', context: 'dating' },
        { id: 2, user: 'naughty_newbie', type: 'Verify 18+', date: '5h ago', notes: 'ID uploaded', context: 'adult' }
    ] as any[],

    roles: [
        { 
            id: 'admin', 
            title: 'Admin', 
            description: 'System Administrator', 
            type: 'system', 
            color: 'text-red-500 bg-red-500/10 border-red-500/20', 
            permissions: {
                users: fullPerms,
                content: fullPerms,
                photos: fullPerms,
                videos: fullPerms,
                shorts: fullPerms,
                comics: fullPerms,
                live: fullPerms,
                collection: fullPerms,
                resources: fullPerms,
                arcade: fullPerms,
                ads: fullPerms,
                finance: fullPerms,
                settings: fullPerms,
                engagement: fullPerms
            }
        },
        { 
            id: 'moderator', 
            title: 'Moderator', 
            description: 'Community Moderator', 
            type: 'system', 
            color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', 
            permissions: {
                users: { view: true, create: false, edit: true, delete: false },
                content: { view: true, create: false, edit: true, delete: true },
                photos: { view: true, create: false, edit: true, delete: true },
                videos: { view: true, create: false, edit: true, delete: true },
                shorts: { view: true, create: false, edit: true, delete: true },
                comics: { view: true, create: false, edit: true, delete: true },
                live: { view: true, create: false, edit: true, delete: true },
                collection: { view: true, create: false, edit: false, delete: true },
                resources: { view: true, create: false, edit: false, delete: false },
                arcade: emptyPerms,
                ads: { view: true, create: true, edit: true, delete: false },
                finance: emptyPerms,
                settings: emptyPerms,
                engagement: { view: true, create: false, edit: false, delete: false }
            }
        }
    ] as any[],
    
    blogCategories: ['Design', 'Tech', 'Growth', 'Business', 'Safety'] as string[],
    
    settings: {
        general: {
            siteName: 'LuciSin',
            favicon: '',
            logoUrl: '',
            defaultLanguage: 'English (US)',
            description: 'The ultimate creator platform...'
        },
        socials: {
            twitter: '',
            instagram: '',
            youtube: '',
            facebook: '',
            discord: ''
        },
        seo: { 
            appUrl: 'https://lucisin.com', 
            socialImage: '',
            titleTemplate: '{{title}} | LuciSin',
            description: '',
            enableCanonical: true,
            tagBasedUrls: false,
            robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /settings/\nDisallow: /messages/',
            sections: {
                live: { index: true, autoNoIndex: false, title: '{{title}} | LuciSin', desc: 'Check out this content...' },
                shorts: { index: true, autoNoIndex: false, title: '{{title}} | LuciSin', desc: 'Check out this content...' },
                photos: { index: true, autoNoIndex: false, title: '{{title}} | LuciSin', desc: 'Check out this content...' },
                comics: { index: true, autoNoIndex: false, title: '{{title}} | LuciSin', desc: 'Check out this content...' },
                collection: { index: true, autoNoIndex: false, title: '{{title}} | LuciSin', desc: 'Check out this item...' },
                games: { index: true, autoNoIndex: false, title: '{{title}} | LuciSin', desc: 'Play this game...' },
                blog: { index: true, autoNoIndex: false, title: '{{title}} | LuciSin', desc: 'Read this article...' }
            }
        },
        performance: {
            media: {
                videoCompressor: true,
                lazyLoad: true,
                cdnCaching: true
            },
            watermark: {
                enabled: true,
                text: 'LuciSin',
                position: 'Bottom Right',
                opacity: 50
            }
        },
        appearance: { 
            mode: 'auto',
            manualTheme: 'Standard',
            calendar: {
                halloween: { startMonth: 9, startDay: 20, endMonth: 10, endDay: 1 },
                christmas: { startMonth: 11, startDay: 15, endMonth: 11, endDay: 31 },
                newYear: { startMonth: 11, startDay: 28, endMonth: 0, endDay: 3 },
                prideDay: { startMonth: 5, startDay: 1, endMonth: 5, endDay: 30 },
                comingOut: { startMonth: 9, startDay: 11, endMonth: 9, endDay: 11 }
            }
        },
        landing: {
            heroVideo: '',
            movementTitle: 'The Movement',
            movementDesc: "LuciSin isn't just an app...",
            datingCard: { title: 'Dating', image: '', desc: 'A safe space for connection.' },
            naughtyCard: { title: 'Naughty', image: '', desc: 'Explore exclusive content.' }
        },
        features: {
            liveStreaming: true,
            shorts: true,
            photos: true,
            comics: true,
            collection: true,
            arcade: true,
            blog: true,
            dating: true,
            naughty: true
        },
        monetization: {
            tiers: {
                prestar: { name: 'PreStar', price: 14.99, enabled: true, features: [] },
                lucistar: { name: 'LuciStar', price: 19.99, enabled: true, features: [] }
            },
            packages: [
                { id: 1, amount: 500, price: 4.99, bonus: 0 },
                { id: 2, amount: 1200, price: 9.99, bonus: 200 },
                { id: 3, amount: 3500, price: 24.99, bonus: 500 },
                { id: 4, amount: 8000, price: 49.99, bonus: 1500 }
            ]
        },
        contentAds: {
            dating: {
                homeFeed: { enabled: true },
                shortsFeed: { enabled: true },
                videoMedia: { enabled: true },
                banners: { enabled: true },
                searchResults: { enabled: true },
                videosFeed: { enabled: true },
                photosFeed: { enabled: true },
                comicsFeed: { enabled: true },
                collectionFeed: { enabled: true },
                resourceFeed: { enabled: true },
                liveFeed: { enabled: true },
                exploreMore: { enabled: true },
                highImpact: { enabled: true },
                postDetail: { enabled: true }
            },
            naughty: {
                homeFeed: { enabled: true },
                shortsFeed: { enabled: true },
                videoMedia: { enabled: true },
                banners: { enabled: true },
                searchResults: { enabled: true },
                videosFeed: { enabled: true },
                photosFeed: { enabled: true },
                comicsFeed: { enabled: true },
                collectionFeed: { enabled: true },
                resourceFeed: { enabled: true },
                liveFeed: { enabled: true },
                exploreMore: { enabled: true },
                highImpact: { enabled: true },
                postDetail: { enabled: true }
            }
        },
        configs: {
            arcade: {
                games: {}
            },
            random: {
                allowText: true,
                genderLock: true,
                genderCost: { 'Man': 0, 'Woman': 10 }
            }
        },
        agenda: {
            genders: [{ id: 'g1', label: 'Man' }, { id: 'g2', label: 'Woman' }],
            pronouns: ['He/Him', 'She/Her', 'They/Them'],
            orientations: [{ id: 'o1', label: 'Straight' }, { id: 'o2', label: 'Gay' }],
            interests: [{ id: 'i1', label: 'Gaming' }, { id: 'i2', label: 'Art' }],
            regions: [
                { id: 'r1', label: 'English (US)' }, 
                { id: 'r2', label: 'Spanish' },
                { id: 'r3', label: 'French' },
                { id: 'r4', label: 'Portuguese' },
                { id: 'r5', label: 'Arabic' }
            ]
        },
        leaderboard: {
            dating: { first: 1000, second: 500, third: 250 },
            naughty: { first: 2000, second: 1000, third: 500 }
        }
    },
    
    apiSettings: {
        liveStreaming: {},
        payments: {},
        storage: {},
        ai: {},
        ads: {
            mode: 'SFW',
            sfw: { exoclick: {}, popads: {} },
            nsfw: { exoclick: {}, popads: {} }
        }
    },
    
    pointsSettings: {
        postGeneric: 10,
        postPhoto: 20,
        postShort: 15,
        postVideo: 50,
        postComic: 30,
        postCollection: 40,
        likeReward: 1,
        commentReward: 2,
        streamWatchReward: 5,
        videoWatchReward: 3,
        articleViewReward: 5,
        collectionBuyReward: 100,
        referralReward: 500,
        pointsPerDollar: 100,
        dailyCap: 1000,
        tipRewardRate: 10,
        tipFee: 5,
        pollCreationFee: 50,
        prestarCommission: 10,
        lucistarCommission: 5,
        pollPostReward: 5,
        pollUserShare: 80,
        pollCommunityShare: 10,
        pollSiteShare: 10,
        contestUploadReward: 100,
        contestHeatReward: 5,
        contestCommentReward: 10,
        contestViewReward: 2,
        levels: []
    }
};

export const db = {
    // User Methods
    getUsers: (context?: 'dating' | 'adult') => {
        let users = store.users.length > 0 ? store.users : [];
        if (context) {
            // Strictly filter by context/preference
            return users.filter(u => u.contentPreference === context);
        }
        return users;
    },
    getUser: (identifier: string) => {
        if (identifier === 'admin') return {
            id: '1002', username: 'admin', displayName: 'System Admin', role: 'admin',
            avatarUrl: 'https://ui-avatars.com/api/?name=Admin', isVerified: true, isPremium: true,
            permissions: {}, region: 'English (US)', contentPreference: 'dating'
        };
        const found = store.users.find(u => u.username === identifier || u.id === identifier || u.email === identifier);
        return found || null;
    },
    createUser: (user: any) => {
        store.users.push({ ...user, id: `u_${Date.now()}` });
        return user;
    },
    updateUser: (id: string, updates: any) => {
        const index = store.users.findIndex(u => u.id === id);
        if (index !== -1) {
            store.users[index] = { ...store.users[index], ...updates };
            return store.users[index];
        }
        return null;
    },
    warnUser: (id: string, reason: string) => {
        db.logAction('system', 'warn_user', 'user', id, reason);
    },
    
    // Auth Helper
    isFollowing: (userId: string, targetId: string) => true,
    followUser: (userId: string, targetId: string) => true,

    // Content Methods
    getPosts: () => store.posts,
    getUserPosts: (userId: string) => store.posts.filter(p => p.userId === userId),
    createPost: (post: any) => {
        const newPost = { ...post, id: Date.now(), heat: 0, comments: 0, views: 0 };
        store.posts.unshift(newPost);
        return newPost;
    },
    updatePost: (id: string | number, updates: any) => {
        const index = store.posts.findIndex(p => p.id == id);
        if (index !== -1) store.posts[index] = { ...store.posts[index], ...updates };
    },
    deletePost: (id: string | number) => {
        store.posts = store.posts.filter(p => p.id != id);
    },
    getComments: (postId: string | number) => store.comments.filter(c => c.postId == postId),
    addComment: (postId: string | number, comment: any) => {
        store.comments.push({ ...comment, postId });
    },
    toggleLike: (postId: string | number) => true,
    
    // Specialized Content Getters
    getPhotos: () => store.posts.filter(p => p.type === 'PHOTO'),
    getVideos: () => store.posts.filter(p => p.type === 'VIDEO'),
    getShorts: () => store.posts.filter(p => p.type === 'SHORT'),
    getComics: () => store.posts.filter(p => p.type === 'COMIC'),
    getProducts: () => store.posts.filter(p => p.type === 'PRODUCT' || p.type === 'COLLECTION'),
    getStreams: () => [], 

    injectContent: (items: any[], context: string) => {
        return items;
    },

    // Blog
    getBlogCategories: () => store.blogCategories,
    addBlogCategory: (cat: string) => store.blogCategories.push(cat),
    removeBlogCategory: (cat: string) => {
        store.blogCategories = store.blogCategories.filter(c => c !== cat);
    },
    
    getContentCategories: (type: string) => {
         if (type === 'RESOURCE') return store.blogCategories;
         
         const categories: Record<string, string[]> = {
             'PHOTO': ['Portrait', 'Landscape', 'Abstract', 'Urban', 'Nature', 'Fashion', 'Editorial', 'B&W', 'Macro', 'Film', 'Digital'],
             'VIDEO': ['Vlog', 'Gaming', 'Tech', 'Music', 'Cinema', 'React', 'Sports', 'Education', 'Comedy', 'ASMR'],
             'SHORT': ['Dance', 'Comedy', 'Tips', 'LifeHacks', 'Pets', 'Viral', 'Gaming', 'Food'],
             'COMIC': ['Action', 'Romance', 'Fantasy', 'Sci-Fi', 'Horror', 'Slice of Life', 'Superhero', 'Noir', 'Comedy', 'Drama', 'Mystery'],
             'COLLECTION': ['Assets', 'Merch', 'Tools', 'Art', 'Music', '3D Models', 'Software', 'Services', 'Presets', 'Tutorials'],
             'POLL': ['Community', 'Feedback', 'Fun', 'Trivia', 'Politics', 'Sports'],
             'POST': ['Discussion', 'News', 'Question', 'Story', 'Updates', 'Lifestyle']
         };
 
         return categories[type] || ['General'];
     },

    // Roles & Permissions
    getRoles: () => store.roles,
    saveRoles: (roles: any[]) => { store.roles = roles; },
    
    // Moderation - Context Aware
    getVerificationRequests: (context?: 'dating' | 'adult') => {
        if (context) {
            return store.verificationRequests.filter(r => r.context === context);
        }
        return store.verificationRequests;
    },
    removeVerificationRequest: (id: number) => {
        store.verificationRequests = store.verificationRequests.filter((r: any) => r.id !== id);
    },
    getReports: (context?: 'dating' | 'adult') => {
        if (context) {
            return store.reports.filter(r => r.context === context);
        }
        return store.reports;
    },
    getLogs: (context?: 'dating' | 'adult') => {
        if (context) {
            return store.logs.filter(l => l.context === context);
        }
        return store.logs;
    },
    logAction: (actor: string, action: string, type: string, targetId: string, details?: string) => {
        store.logs.unshift({ id: Date.now(), actor, action, type, targetId, details, timestamp: Date.now(), context: 'dating' });
    },
    getPendingApprovals: (context?: 'dating' | 'adult') => {
         if (context) {
            return store.pendingApprovals.filter(a => a.context === context);
        }
        return store.pendingApprovals;
    },
    removePendingApproval: (id: number) => {
        store.pendingApprovals = store.pendingApprovals.filter((a: any) => a.id !== id);
    },
    addPendingApproval: (request: any) => {
        const newReq = {
            ...request,
            id: Date.now(),
            date: 'Just now',
            status: 'pending'
        };
        store.pendingApprovals.unshift(newReq);
        return newReq;
    },

    // Wallet & Points
    getWallet: (userId: string) => store.wallet,
    updateWallet: (userId: string, amount: number) => {
        store.wallet.balance += amount;
        return store.wallet.balance;
    },
    getPointsSettings: () => store.pointsSettings,
    savePointsSettings: (s: any) => { store.pointsSettings = s; },
    
    // Arcade
    getGameHistory: () => store.gameHistory,
    addGameResult: (result: any) => store.gameHistory.unshift(result),
    getArcadeConfig: (gameId: string) => {
        return store.settings.configs.arcade.games[gameId] || { enabled: true };
    },

    // Ads & Promos
    getPromotions: () => store.promotions,
    createPromotion: (data: any) => {
        store.promotions.push({ ...data, id: Date.now(), status: 'pending' });
    },
    updatePromotionStatus: (id: string, status: string) => {
        const p = store.promotions.find((x: any) => x.id == id);
        if (p) p.status = status;
    },

    // Contests & Pride
    getContests: () => store.contests,
    createContest: (data: any) => store.contests.push({ ...data, id: Date.now(), status: 'active' }),
    getPrideTags: () => store.prideTags,
    togglePrideTag: (tag: string) => {
        if (store.prideTags.includes(tag)) store.prideTags = store.prideTags.filter(t => t !== tag);
        else store.prideTags.push(tag);
        return store.prideTags.includes(tag);
    },

    // Settings
    getSiteSettings: () => store.settings,
    saveSiteSettings: (s: any) => { store.settings = s; },
    getApiSettings: () => store.apiSettings,
    saveApiSettings: (s: any) => { store.apiSettings = s; },

    // Misc
    getNotifications: () => store.notifications,
    getChatContacts: () => [] 
};
