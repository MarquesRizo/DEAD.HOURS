import { MetadataRoute } from 'next';
import { CHAPTERS } from '@/lib/chaptersData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dead-hours.vercel.app';

  const chapterUrls = CHAPTERS.map((c) => ({
    url: `${baseUrl}/manual/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/manual`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/cadastro`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/busca`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    },
    ...chapterUrls
  ];
}
