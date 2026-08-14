import Parser from 'rss-parser';
import { getCategoryRssFeed, getStateRssFeed, RSS_SOURCES, RssFeedSource } from '../src/data/rssFeeds';
import { Category, SourceArticle } from '../src/types';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['dc:creator', 'dcCreator'],
      ['dc:date', 'dcDate'],
    ],
  },
});

export function formatISTTime(dateObj: Date): string {
  try {
    return (
      dateObj.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }) + ' IST'
    );
  } catch {
    return '10:00 AM IST';
  }
}

export function formatISTDate(dateObj: Date): string {
  try {
    return dateObj.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '14 Aug 2026';
  }
}

function stripHtmlAndDecode(input: string): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetch feed XML with realistic browser headers and retry strategy on 503/429 or timeout
 */
async function fetchXmlWithRetry(url: string, retries = 2, delayMs = 400): Promise<string | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    let timeoutId: NodeJS.Timeout | undefined;
    try {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }

      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds per fetch attempt

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,application/rss+xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,en-IN;q=0.8',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (res.ok) {
        return await res.text();
      }

      if (res.status === 503 || res.status === 429) {
        if (attempt < retries) continue;
      }

      return null;
    } catch {
      if (timeoutId) clearTimeout(timeoutId);
      if (attempt < retries) continue;
    }
  }
  return null;
}

export async function fetchFeedArticles(source: RssFeedSource): Promise<SourceArticle[]> {
  try {
    const xml = await fetchXmlWithRetry(source.url);
    if (!xml) return [];

    const feed = await parser.parseString(xml);
    const articles: SourceArticle[] = [];

    for (const item of feed.items || []) {
      if (!item.title) continue;

      let cleanTitle = stripHtmlAndDecode(item.title).replace(/\s*-\s*[^-]+$/, '').trim();
      if (!cleanTitle) cleanTitle = item.title;

      const rawAuthor = (item as any).dcCreator || (item as any).creator || (item as any).author || source.name;
      const rawSource = stripHtmlAndDecode(rawAuthor);

      const rawDate = item.isoDate || item.pubDate || (item as any).dcDate;
      const parsedDate = rawDate ? new Date(rawDate) : new Date();
      const pubDateValid = !isNaN(parsedDate.getTime()) ? parsedDate : new Date();

      const rawSnippet = item.contentSnippet || item.summary || item.content || cleanTitle;
      const cleanSnippet = stripHtmlAndDecode(rawSnippet).slice(0, 300);

      articles.push({
        id: `art-${Math.random().toString(36).substring(2, 10)}`,
        title: cleanTitle,
        url: item.link || source.url,
        sourceName: rawSource.length < 35 && rawSource.length > 1 ? rawSource : source.name,
        sourceTier: source.tier,
        publishedAt: pubDateValid.toISOString(),
        publishedAtIST: formatISTTime(pubDateValid),
        snippet: cleanSnippet || cleanTitle,
        category: (source.category as Category) || 'India',
        location: source.location || 'India',
      });

      if (articles.length >= 12) break; // Limit per feed for fast processing
    }

    return articles;
  } catch (error) {
    console.warn(
      `[RSS Parse] Notice: Failed to parse feed ${source.id} (${source.url}):`,
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

/**
 * Execute promises in batches to prevent bursting external RSS servers
 */
async function processInBatches<T, R>(
  items: T[],
  batchSize: number,
  delayBetweenBatchesMs: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    const chunkResults = await Promise.all(chunk.map((item) => fn(item)));
    results.push(...chunkResults);
    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, delayBetweenBatchesMs));
    }
  }
  return results;
}

export async function fetchAllRssArticles(selectedState: string = 'Tamil Nadu'): Promise<{
  articles: SourceArticle[];
  stateArticles: SourceArticle[];
}> {
  // Main national and global feeds
  const activeSources = RSS_SOURCES.filter((s) => s.category !== 'State');

  // Targeted state live feed
  const stateSource = getStateRssFeed(selectedState);
  const sourcesToFetch = [...activeSources, stateSource];

  const feedResults = await processInBatches(
    sourcesToFetch,
    4,
    150,
    async (src) => {
      const arts = await fetchFeedArticles(src);
      return { src, arts };
    }
  );

  let articles: SourceArticle[] = [];
  let stateArticles: SourceArticle[] = [];

  for (const res of feedResults) {
    if (res.src.location === selectedState || res.src.category === 'State') {
      stateArticles.push(...res.arts);
    } else {
      articles.push(...res.arts);
    }
  }

  return { articles, stateArticles };
}

export async function fetchCategoryRssArticles(category: string): Promise<SourceArticle[]> {
  const feedSource = getCategoryRssFeed(category);
  if (!feedSource) return [];
  return await fetchFeedArticles(feedSource);
}

export async function fetchStateRssArticles(stateName: string): Promise<SourceArticle[]> {
  const feedSource = getStateRssFeed(stateName);
  return await fetchFeedArticles(feedSource);
}

export async function fetchCustomQueryRssArticles(query: string): Promise<SourceArticle[]> {
  const customSource: RssFeedSource = {
    id: `query-${encodeURIComponent(query).slice(0, 20)}`,
    name: `Search: ${query}`,
    category: 'India',
    location: 'India',
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(query)}+when:24h&hl=en-IN&gl=IN&ceid=IN:en`,
    tier: 'tier_2',
  };
  return await fetchFeedArticles(customSource);
}

