import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string;
}

export function SEO({ title, description, canonicalPath = '', keywords }: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (attribute: 'name' | 'property', attrValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, attrValue);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // 3. Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);

    // 4. Twitter Tags
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);

    // 5. Canonical Link
    const fullCanonicalUrl = window.location.origin + canonicalPath;
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = fullCanonicalUrl;
  }, [title, description, canonicalPath, keywords]);

  return null;
}
