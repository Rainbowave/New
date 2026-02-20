
import { useEffect } from 'react';

export const useSEO = (
    title: string, 
    description: string, 
    keywords: string[] = [], 
    image: string = '', 
    type: string = 'website',
    structuredData: any = null,
    canonicalUrl?: string
) => {
    useEffect(() => {
        // Update Document Title
        document.title = title;

        // Helper to update or create meta tags
        const updateMeta = (name: string, content: string) => {
            let tag = document.querySelector(`meta[name="${name}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('name', name);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        // Helper for Open Graph tags
        const updateOG = (property: string, content: string) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        // Standard Meta
        updateMeta('description', description);
        updateMeta('keywords', keywords.join(', '));

        // Open Graph
        updateOG('og:title', title);
        updateOG('og:description', description);
        updateOG('og:type', type);
        if (image) updateOG('og:image', image);
        
        // Twitter Card
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', title);
        updateMeta('twitter:description', description);
        if (image) updateMeta('twitter:image', image);

        // Canonical Tag
        let link = document.querySelector('link[rel="canonical"]');
        if (canonicalUrl) {
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                document.head.appendChild(link);
            }
            link.setAttribute('href', canonicalUrl);
        } else if (link) {
            document.head.removeChild(link);
        }

        // Structured Data (JSON-LD) Injection for Rich Snippets
        if (structuredData) {
            let script = document.querySelector('#structured-data');
            if (!script) {
                script = document.createElement('script');
                script.id = 'structured-data';
                script.setAttribute('type', 'application/ld+json');
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(structuredData);
        }

    }, [title, description, keywords, image, type, structuredData, canonicalUrl]);
};
