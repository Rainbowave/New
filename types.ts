


export enum ContentType {
  VIDEO = 'VIDEO',
  LIVE = 'LIVE',
  PHOTO = 'PHOTO',
  COMIC = 'COMIC',
  GAME = 'GAME',
  PRODUCT = 'PRODUCT',
  AD = 'AD'
}

export type UserRole = 'user' | 'creator' | 'moderator' | 'admin';

export type ModeratorRoleType = 'support' | 'content' | 'guardian' | 'senior' | 'community' | 'photos' | 'shorts' | 'collection' | 'comics' | 'arcade' | 'live';
export type AdminRoleType = 'finance' | 'super';

export interface NotificationPreferences {
  // Creator / Income
  newSubscriptions: boolean;
  tips: boolean;
  ppvUnlocks: boolean;
  
  // Social / Interaction
  messages: boolean;
  comments: boolean;
  newContent: boolean; // From followed users
  liveStatus: boolean; // From followed users
  
  // Account / Billing
  expiringSubscriptions: boolean;
  upcomingRenewals: boolean;
  
  // Privacy / Mode
  allowCrossMode: boolean; // Receive Naughty notifs while in Dating mode
}

export interface ModeratorPermissions {
  type: ModeratorRoleType;
  // Core Safety
  canBanUsers: boolean;
  canDeleteContent: boolean;
  canVerifyUsers: boolean;
  canViewReports: boolean;
  canManageTags: boolean;

  // Community Granular
  canEditProfiles?: boolean;
  canManageLeaderboard?: boolean;
  canApproveMods?: boolean; // Mod Acceptance

  // Content Granular
  accessPhotos?: boolean;
  accessVideos?: boolean;
  accessShorts?: boolean;
  accessComics?: boolean;
  accessLive?: boolean;
  accessCollection?: boolean;
  accessArcade?: boolean;

  // Blog / Resource Granular
  blogStats?: boolean;
  blogManageArticles?: boolean; // Add/Edit/Delete
  blogSettings?: boolean;
}

export interface CreatorSettings {
  commissionRate: number;
  instantPayout: boolean;
  maxStreamQuality: string;
  canSellPhysicalGoods: boolean;
  verifiedLuciStar: boolean;
}

export interface UserSettings {
  canMessage: boolean;
  canMonetize: boolean; // New flag for Regular Member restriction
  shadowBanned: boolean;
  dailyUploadLimit: number;
  maxWalletBalance: number;
}

export interface AdminPermissions {
  type: AdminRoleType;
  canAccessFinances: boolean;
  canManageAdmins: boolean;
  canEditSiteSettings: boolean;
  canViewSystemLogs: boolean;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  backgroundUrl?: string;
  description?: string;
  naughtyDescription?: string; // Mode-specific bio
  location?: string;
  region?: string; // Added field
  tags?: string[];
  suggestedTags?: string[];
  birthdate?: string;
  gender?: string;
  sexuality?: string;
  pronouns?: string;
  pronunciation?: string; // New Field
  isVerified: boolean;
  followers: number;
  joinedAt?: string;
  isPremium?: boolean;
  premiumExpiry?: string;
  isAdmin?: boolean;
  role: UserRole;
  
  // Role Specific Configuration
  moderatorPermissions?: ModeratorPermissions;
  creatorSettings?: CreatorSettings;
  userSettings?: UserSettings;
  adminPermissions?: AdminPermissions;

  coins?: number;
  walletBalance?: number;
  contentPreference?: 'dating' | 'adult';
  isLuciStar?: boolean;
  scheduledDeletionDate?: string;
  language?: string;
  verificationStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  deletionMonths?: number;
  // Privacy & Security Toggles
  appearInSearch?: boolean;
  showOnlineStatus?: boolean;
  profileVisibility?: 'public' | 'followers' | 'private';
  messageFrom?: 'everyone' | 'followers' | 'verified';
  showPronouns?: boolean;
  showSexuality?: boolean;
  vaultProtection?: boolean;
  watermarkEnabled?: boolean; // New setting
  // Notification Settings
  notificationPreferences?: NotificationPreferences;
  // Wallet Settings
  minCashout?: number;
  preferredPayoutMethod?: 'stripe' | 'nowpayments';
  payoutAddress?: string;
}

export interface PaymentRecord {
  id: string;
  amount: string;
  type: 'deposit' | 'withdrawal' | 'subscription' | 'tip';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  mode: 'dating' | 'adult';
}

export interface SubscriberRecord {
  id: string;
  username: string;
  avatar: string;
  status: 'new' | 'active' | 'canceled';
  tier: string;
  expiryDate: string;
  modeSource: 'dating' | 'adult';
}

export interface NavItem {
  label: string;
  path: string;
  icon: any; 
}