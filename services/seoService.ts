
import { db } from './db';

export const seoService = {
  /**
   * Generates a standard XML sitemap string based on current DB content.
   */
  generateSitemap: () => {
    const settings = db.getSiteSettings();
    const baseUrl = settings.seo?.appUrl || 'https://lucisin.com';
    const currentDate = new Date().toISOString();
    const sections = ((settings.seo as any)?.sections || {}) as any;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // 1. Static Routes
    const staticRoutes = [
      '/', '/home', '/auth/login', '/auth/register',
      '/about', '/terms', '/privacy', '/support'
    ];

    staticRoutes.forEach(route => {
      xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
    });

    // Add Section Routes based on Indexing Config
    if (sections.live?.index) staticRoutes.push('/live');
    if (sections.shorts?.index) staticRoutes.push('/shorts');
    if (sections.photos?.index) staticRoutes.push('/photos');
    if (sections.comics?.index) staticRoutes.push('/comics');
    if (sections.collection?.index) staticRoutes.push('/collection');
    if (sections.games?.index) staticRoutes.push('/arcade');
    if (sections.blog?.index) staticRoutes.push('/star-resources'); // Blog route

    // 2. Dynamic Users (Profiles)
    // Always index active users, filtering happens at the list generation level usually
    const users = db.getUsers();
    users.forEach((user: any) => {
        // Example check: if (sections.profiles?.index) ...
       xml += `
  <url>
    <loc>${baseUrl}/profile/${user.username}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    // 3. Dynamic Posts
    const posts = db.getPosts();
    posts.forEach((post: any) => {
       // Check if section is indexed
       let shouldIndex = true;
       if (post.type === 'LIVE' || post.type === 'STREAM') shouldIndex = sections.live?.index;
       else if (post.type === 'SHORT' || post.type === 'VIDEO') shouldIndex = sections.shorts?.index;
       else if (post.type === 'PHOTO') shouldIndex = sections.photos?.index;
       else if (post.type === 'COMIC') shouldIndex = sections.comics?.index;
       else if (post.type === 'PRODUCT' || post.type === 'COLLECTION') shouldIndex = sections.collection?.index;
       else if (post.type === 'RESOURCE') shouldIndex = sections.blog?.index;
       
       if (shouldIndex) {
           xml += `
  <url>
    <loc>${baseUrl}/post/${post.id}</loc>
    <lastmod>${new Date(post.timestamp).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
       }
    });

    xml += `
</urlset>`;
    
    return xml;
  },

  /**
   * Generates Robots.txt content
   */
  generateRobotsTxt: (allowIndexing: boolean = true) => {
     const settings = db.getSiteSettings();
     const baseUrl = settings.seo?.appUrl || 'https://lucisin.com';
     
     if (!allowIndexing) {
         return `User-agent: *\nDisallow: /`;
     }

     return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /settings/
Disallow: /messages/
Disallow: /notifications/

Sitemap: ${baseUrl}/sitemap.xml`;
  },

  /**
   * Helper to download the generated sitemap as a file
   */
  downloadSitemap: () => {
      const xml = seoService.generateSitemap();
      const blob = new Blob([xml], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  }
};