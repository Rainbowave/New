
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { User } from './types';
import { Loader2 } from 'lucide-react';
import { authService } from './services/authService';
import { db } from './services/db';

// --- Optimized Lazy Loading of Pages ---
const Home = lazy(() => import('./pages/Home'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const PhotoDetail = lazy(() => import('./pages/PhotoDetail'));
const PollDetail = lazy(() => import('./pages/PollDetail')); 
const VideoDetail = lazy(() => import('./pages/VideoDetail'));
const Live = lazy(() => import('./pages/Live'));
const StreamSetup = lazy(() => import('./pages/live/StreamSetup')); 
const Profile = lazy(() => import('./pages/Profile'));
const Videos = lazy(() => import('./pages/Videos')); 
const Photos = lazy(() => import('./pages/Photos'));
const Collection = lazy(() => import('./pages/Collection'));
const CollectionDetail = lazy(() => import('./pages/CollectionDetail')); 
const MyCollection = lazy(() => import('./pages/marketplace/Orders')); 
const Comics = lazy(() => import('./pages/Comics'));
const ComicDetail = lazy(() => import('./pages/ComicDetail'));
const ComicReader = lazy(() => import('./pages/comics/Reader'));
const Arcade = lazy(() => import('./pages/Arcade'));
const GameDetail = lazy(() => import('./pages/GameDetail'));
const Leaderboard = lazy(() => import('./pages/games/Leaderboard'));
const GlobalLeaderboard = lazy(() => import('./pages/Leaderboard'));
const Support = lazy(() => import('./pages/Support'));
const HelpCenter = lazy(() => import('./pages/HelpCenter')); 
const KnowledgeBook = lazy(() => import('./pages/KnowledgeBook')); 
const KnowledgeDetail = lazy(() => import('./pages/KnowledgeDetail')); 
const Earnings = lazy(() => import('./pages/Earnings'));
const Points = lazy(() => import('./pages/Points'));
const PointsMore = lazy(() => import('./pages/PointsMore'));
const RandomCam = lazy(() => import('./pages/RandomCam'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const Referrals = lazy(() => import('./pages/Referrals'));
const Landing = lazy(() => import('./pages/Landing'));
const StartCreating = lazy(() => import('./pages/StartCreating'));
const Settings = lazy(() => import('./pages/Settings'));
const Chat = lazy(() => import('./pages/Chat'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Search = lazy(() => import('./pages/Search'));
const SeeMore = lazy(() => import('./pages/SeeMore'));
const NotFound = lazy(() => import('./pages/NotFound'));
const StaticPages = lazy(() => import('./pages/Static'));
const GameHistory = lazy(() => import('./pages/games/History'));
const UserNetwork = lazy(() => import('./pages/UserNetwork'));
const TagFeed = lazy(() => import('./pages/TagFeed'));
const ManageContent = lazy(() => import('./pages/ManageContent'));
const Intimacy = lazy(() => import('./pages/Intimacy')); 
const CreateCircle = lazy(() => import('./pages/CreateCircle'));
const Hashtags = lazy(() => import('./pages/Hashtags'));

// New Experience Modes
const Dating = lazy(() => import('./pages/Dating'));
const Naughty = lazy(() => import('./pages/Naughty'));

// Auth
const AuthEntry = lazy(() => import('./pages/auth/AuthEntry'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// Admin
const AdminLayout = lazy(() => import('./components/layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminUserDetail = lazy(() => import('./pages/admin/UserDetail'));
const AdminContent = lazy(() => import('./pages/admin/Content'));
const AdminVerification = lazy(() => import('./pages/admin/Verification'));
const AdminAds = lazy(() => import('./pages/admin/Ads'));
const AdminFinance = lazy(() => import('./pages/admin/Finance'));
const AdminPerformance = lazy(() => import('./pages/admin/Performance'));
const AdminPointsSettings = lazy(() => import('./pages/admin/PointsSettings'));
const AdminSiteSettings = lazy(() => import('./pages/admin/SiteSettings'));
const AdminEngagement = lazy(() => import('./pages/admin/AdminEngagement'));
const AdminApi = lazy(() => import('./pages/admin/Api'));
const AdminStreams = lazy(() => import('./pages/admin/Streams'));
const AdminPosts = lazy(() => import('./pages/admin/Posts'));
const AdminRoles = lazy(() => import('./pages/admin/Roles')); 
const AdminCommunity = lazy(() => import('./pages/admin/Community'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));
const AdminSiteContent = lazy(() => import('./pages/admin/SiteContent'));
const AdminSuspensions = lazy(() => import('./pages/admin/Suspensions'));
const AdminUserApprovals = lazy(() => import('./pages/admin/UserApprovals'));
const AdminArcade = lazy(() => import('./pages/admin/AdminArcade'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-dark-900">
    <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
  </div>
);

// --- SEASONAL THEME LOGIC ---
const applySeasonalTheme = (settings: any) => {
    // Safety check: ensure appearance and calendar exist
    if (!settings?.appearance?.calendar) return;
    
    let themeName = 'Standard';
    let mainColor = '#900933'; // Default Brand
    let secondColor = '#0ad396'; // Default Second

    if (settings.appearance.mode === 'manual') {
        themeName = settings.appearance.manualTheme || 'Standard';
    } else {
        // Auto Logic with configurable dates
        const today = new Date();
        const currentM = today.getMonth(); // 0-11
        const currentD = today.getDate();
        
        // Helper to check range including year wrap
        const inRange = (cfg: any) => {
            if (!cfg) return false;
            const { startMonth: sm, startDay: sd, endMonth: em, endDay: ed } = cfg;
            
            if (sm === em) {
                return currentM === sm && currentD >= sd && currentD <= ed;
            } else if (sm < em) {
                // e.g. Oct 20 to Nov 1
                return (currentM === sm && currentD >= sd) || 
                       (currentM === em && currentD <= ed) || 
                       (currentM > sm && currentM < em);
            } else {
                // e.g. Dec 27 to Jan 3 (Year Wrap)
                return (currentM === sm && currentD >= sd) || 
                       (currentM === em && currentD <= ed) || 
                       (currentM > sm || currentM < em); 
            }
        };

        const cal = settings.appearance.calendar;
        if (inRange(cal.halloween)) {
             themeName = 'Halloween';
        } else if (inRange(cal.christmas)) {
             themeName = 'Christmas';
        } else if (inRange(cal.newYear)) {
             themeName = 'New Year';
        }
    }

    // Apply Colors based on themeName
    switch(themeName) {
        case 'Halloween':
            mainColor = '#ea580c'; secondColor = '#9333ea'; break;
        case 'Christmas':
            mainColor = '#dc2626'; secondColor = '#16a34a'; break;
        case 'New Year':
            mainColor = '#ca8a04'; secondColor = '#cbd5e1'; break;
        default:
            mainColor = '#900933'; secondColor = '#0ad396'; break;
    }

    document.documentElement.style.setProperty('--brand-main', mainColor);
    document.documentElement.style.setProperty('--brand-second', secondColor);
    
    return themeName;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 1. Initialize Auth
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setIsInitialized(true);

    // 2. Initialize Seasonal Theme from DB settings
    const settings = db.getSiteSettings();
    const activeSeason = applySeasonalTheme(settings);
    if (activeSeason) {
        console.log(`[System] Active Seasonal Protocol: ${activeSeason}`);
    }
  }, []);

  const handleLogin = () => {
    setCurrentUser(authService.getCurrentUser());
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const handleUserUpdate = (updatedUser: User) => {
      setCurrentUser(updatedUser);
  };

  if (!isInitialized) return <PageLoader />;

  const isAdmin = currentUser?.role === 'admin';
  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!currentUser ? <Landing /> : <Navigate to={isStaff ? "/admin" : "/home"} />} />
          <Route path="/start-creating" element={<StartCreating />} />
          
          {/* Auth Entry & Flows */}
          <Route path="/auth" element={!currentUser ? <AuthEntry /> : <Navigate to={isStaff ? "/admin" : "/home"} />} />
          <Route path="/auth/login" element={!currentUser ? <Login onLogin={handleLogin} /> : <Navigate to={isStaff ? "/admin" : "/home"} />} />
          <Route path="/auth/register" element={!currentUser ? <Register /> : <Navigate to="/home" />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          
          <Route path="/about" element={<StaticPages type="about" />} />
          <Route path="/terms" element={<StaticPages type="terms" />} />
          <Route path="/privacy" element={<StaticPages type="privacy" />} />
          
          {/* Protected User Routes */}
          {currentUser && !isStaff && (
            <Route path="/*" element={
                <Layout user={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate}>
                    <Suspense fallback={<PageLoader />}> 
                        <Routes>
                            <Route path="/home" element={<Home user={currentUser} />} />
                            <Route path="/profile/dating" element={<Dating currentUser={currentUser} />} />
                            <Route path="/profile/naughty" element={<Naughty currentUser={currentUser} />} />
                            <Route path="/intimacy" element={<Intimacy />} />
                            <Route path="/intimacy/create" element={<CreateCircle />} />
                            
                            <Route path="/post/:id" element={<PostDetail />} />
                            <Route path="/photo/:id" element={<PhotoDetail />} />
                            <Route path="/poll/:id" element={<PollDetail />} /> 
                            <Route path="/video/:id" element={<VideoDetail />} />
                            <Route path="/tags" element={<Hashtags />} />
                            <Route path="/tags/:tag" element={<TagFeed />} />
                            <Route path="/live" element={<Live />} />
                            <Route path="/live/setup" element={<StreamSetup />} /> 
                            <Route path="/videos" element={<Videos />} /> 
                            <Route path="/photos" element={<Photos />} />
                            <Route path="/comics" element={<Comics />} />
                            <Route path="/comic/:id" element={<ComicDetail />} />
                            <Route path="/comics/read/:id" element={<ComicReader />} />
                            <Route path="/see-more/:type" element={<SeeMore />} />
                            <Route path="/leaderboard" element={<GlobalLeaderboard />} />
                            <Route path="/collection" element={<Collection />} />
                            <Route path="/collection/view/:id" element={<CollectionDetail />} />
                            <Route path="/collection/orders" element={<MyCollection />} />
                            <Route path="/arcade" element={<Arcade />} />
                            <Route path="/arcade/:id" element={<GameDetail />} />
                            <Route path="/arcade/history" element={<GameHistory />} />
                            <Route path="/support" element={<Support />} />
                            <Route path="/help-center" element={<HelpCenter />} />
                            <Route path="/earnings" element={<Earnings />} />
                            <Route path="/points" element={<Points />} />
                            <Route path="/points/more/:type" element={<PointsMore />} />
                            <Route path="/random-cam" element={<RandomCam />} />
                            <Route path="/subscriptions" element={<Subscriptions />} />
                            <Route path="/referrals" element={<Referrals />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/profile/:username/settings" element={<Settings currentUser={currentUser} />} />
                            <Route path="/profile/:username/network/:type" element={<UserNetwork />} />
                            <Route path="/profile/:username/*" element={<Profile currentUser={currentUser} />} />
                            <Route path="/manage-content" element={<ManageContent />} />
                            <Route path="/chat/*" element={<Chat />} />
                            <Route path="/notifications" element={<Notifications />} />
                            
                            {/* Knowledge Book Routes */}
                            <Route path="/knowledge-book" element={<KnowledgeBook />} />
                            <Route path="/star-resources" element={<Navigate to="/knowledge-book" replace />} />
                            <Route path="/resource/:id" element={<Navigate to={`/knowledge/${window.location.hash.split('/').pop()}`} replace />} /> 
                            <Route path="/knowledge/:id" element={<KnowledgeDetail />} />

                            <Route path="*" element={<NotFound />} />
                        </Routes> 
                    </Suspense>
                </Layout>
            } />
          )}

          {/* Admin Routes */}
          {currentUser && isStaff && (
            <Route path="/admin/*" element={
              <AdminLayout user={currentUser} onLogout={handleLogout}>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="users/:id" element={<AdminUserDetail />} />
                      <Route path="content" element={<AdminContent />} />
                      <Route path="verification" element={<AdminVerification />} />
                      <Route path="streams" element={<AdminStreams />} />
                      <Route path="posts" element={<AdminPosts />} />
                      <Route path="roles" element={<AdminRoles />} />
                      <Route path="community" element={<AdminCommunity />} />
                      <Route path="reports" element={<AdminReports />} />
                      <Route path="pages" element={<AdminSiteContent />} />
                      <Route path="suspensions" element={<AdminSuspensions />} />
                      <Route path="approvals" element={<AdminUserApprovals />} />
                      
                      {/* Restricted to Admin only */}
                      <Route path="ads" element={isAdmin ? <AdminAds /> : <Navigate to="/admin" />} />
                      <Route path="finance" element={isAdmin ? <AdminFinance /> : <Navigate to="/admin" />} />
                      <Route path="performance" element={isAdmin ? <AdminPerformance /> : <Navigate to="/admin" />} />
                      <Route path="settings/points" element={isAdmin ? <AdminPointsSettings /> : <Navigate to="/admin" />} />
                      
                      {/* Dynamic Settings Routes */}
                      <Route path="settings/:section" element={isAdmin ? <AdminSiteSettings /> : <Navigate to="/admin" />} />
                      
                      <Route path="engagement" element={isAdmin ? <AdminEngagement /> : <Navigate to="/admin" />} />
                      <Route path="settings/arcade" element={isAdmin ? <AdminArcade /> : <Navigate to="/admin" />} />
                      <Route path="api" element={isAdmin ? <AdminApi /> : <Navigate to="/admin" />} />
                      
                      <Route path="*" element={<Navigate to="/admin" />} />
                  </Routes>
                </Suspense>
              </AdminLayout>
            } />
          )}

          {!currentUser && (
             <Route path="*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
