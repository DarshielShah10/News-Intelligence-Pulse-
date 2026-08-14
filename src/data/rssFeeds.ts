export interface RssFeedSource {
  id: string;
  name: string;
  category: string;
  location: string; // World, India, or State Name
  stateCode?: string;
  url: string;
  tier: 'tier_1' | 'tier_2' | 'tier_3';
}

export const RSS_SOURCES: RssFeedSource[] = [
  // World & Global International Outlets
  {
    id: 'google-world',
    name: 'Google News World',
    category: 'World',
    location: 'World',
    url: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },
  {
    id: 'reuters-world',
    name: 'Reuters',
    category: 'World',
    location: 'World',
    url: 'https://news.google.com/rss/search?q=site:reuters.com+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_1',
  },
  {
    id: 'bbc-world',
    name: 'BBC News',
    category: 'World',
    location: 'World',
    url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    tier: 'tier_2',
  },
  {
    id: 'ap-news-world',
    name: 'Associated Press (AP)',
    category: 'World',
    location: 'World',
    url: 'https://news.google.com/rss/search?q=site:apnews.com+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_1',
  },

  // India National Newspapers & Official Press
  {
    id: 'pib-india',
    name: 'Press Information Bureau (PIB)',
    category: 'India',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=site:pib.gov.in+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_1',
  },
  {
    id: 'toi-national',
    name: 'Times of India',
    category: 'India',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=site:timesofindia.indiatimes.com+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },
  {
    id: 'the-hindu-india',
    name: 'The Hindu',
    category: 'India',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=site:thehindu.com+National+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },
  {
    id: 'indian-express-national',
    name: 'Indian Express',
    category: 'India',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=site:indianexpress.com+India+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },
  {
    id: 'ndtv-national',
    name: 'NDTV News',
    category: 'India',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=site:ndtv.com+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },
  {
    id: 'google-india',
    name: 'Google News India',
    category: 'India',
    location: 'India',
    url: 'https://news.google.com/rss/headlines/section/topic/NATION?hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },

  // Politics
  {
    id: 'google-politics',
    name: 'Indian Politics & Policy',
    category: 'Politics',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=(India+politics+OR+Lok+Sabha+OR+Cabinet+OR+Ministry+OR+Election+Commission)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },

  // Business & Economy
  {
    id: 'et-business',
    name: 'Economic Times',
    category: 'Business',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=site:economictimes.indiatimes.com+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },
  {
    id: 'livemint-business',
    name: 'Livemint',
    category: 'Business',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=site:livemint.com+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },
  {
    id: 'google-business-economy',
    name: 'Markets & Economy',
    category: 'Economy',
    location: 'India',
    url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },

  // Technology, AI & Startups
  {
    id: 'google-ai-models',
    name: 'AI & GenAI Developments',
    category: 'AI',
    location: 'World',
    url: 'https://news.google.com/rss/search?q=(Artificial+Intelligence+OR+Gemini+OR+OpenAI+OR+LLM+OR+DeepSeek+OR+Anthropic+OR+NVIDIA)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_1',
  },
  {
    id: 'techcrunch-ai',
    name: 'TechCrunch',
    category: 'Technology',
    location: 'World',
    url: 'https://techcrunch.com/feed/',
    tier: 'tier_1',
  },
  {
    id: 'google-startups',
    name: 'Indian Startups & Venture',
    category: 'Startups',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=(India+startups+OR+funding+round+OR+unicorn+OR+Y+Combinator+India)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },
  {
    id: 'google-tech-section',
    name: 'Tech Headlines',
    category: 'Technology',
    location: 'World',
    url: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },

  // Science & Space
  {
    id: 'isro-space',
    name: 'ISRO & Space',
    category: 'Space',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=(ISRO+OR+NASA+OR+space+mission+OR+Gaganyaan+OR+satellite+launch)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_1',
  },
  {
    id: 'google-science',
    name: 'Science Frontiers',
    category: 'Science',
    location: 'World',
    url: 'https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },

  // Defence & Security
  {
    id: 'india-defence',
    name: 'Defence & Strategic Affairs',
    category: 'Defence',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=(DRDO+OR+Indian+Army+OR+Indian+Navy+OR+Indian+Air+Force+OR+defence+procurement)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_1',
  },

  // Education & Exams
  {
    id: 'india-education',
    name: 'Education & Exams',
    category: 'Education',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=(UPSC+OR+NEET+OR+CBSE+OR+IIT+OR+IIM+OR+higher+education+India)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },

  // Sports
  {
    id: 'google-sports',
    name: 'Sports Updates',
    category: 'Sports',
    location: 'India',
    url: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },

  // Entertainment
  {
    id: 'google-entertainment',
    name: 'Entertainment & Cinema',
    category: 'Entertainment',
    location: 'India',
    url: 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },

  // Health
  {
    id: 'google-health',
    name: 'Healthcare & Medical',
    category: 'Health',
    location: 'India',
    url: 'https://news.google.com/rss/headlines/section/topic/HEALTH?hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },

  // Environment & Climate
  {
    id: 'google-environment',
    name: 'Environment & Climate',
    category: 'Environment',
    location: 'India',
    url: 'https://news.google.com/rss/search?q=(climate+change+OR+renewable+energy+OR+pollution+OR+solar+energy+India)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
    tier: 'tier_2',
  },
];

export const INDIAN_STATES_LIST = [
  'Tamil Nadu',
  'Maharashtra',
  'Karnataka',
  'Gujarat',
  'Delhi',
  'Rajasthan',
  'Uttar Pradesh',
  'West Bengal',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Bihar',
  'Odisha',
  'Assam',
  'Jharkhand',
  'Chhattisgarh',
  'Uttarakhand',
  'Himachal Pradesh',
  'Goa',
  'Jammu and Kashmir',
];

export function getCategoryRssFeed(category: string): RssFeedSource | null {
  const catLower = category.toLowerCase();
  
  if (catLower === 'world') {
    return {
      id: 'cat-world',
      name: 'World News Live',
      category: 'World',
      location: 'World',
      url: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_2',
    };
  }
  if (catLower === 'india') {
    return {
      id: 'cat-india',
      name: 'India National Live',
      category: 'India',
      location: 'India',
      url: 'https://news.google.com/rss/headlines/section/topic/NATION?hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_2',
    };
  }
  if (catLower === 'business' || catLower === 'economy') {
    return {
      id: 'cat-business',
      name: 'Business & Economy Live',
      category: 'Business',
      location: 'India',
      url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_2',
    };
  }
  if (catLower === 'technology') {
    return {
      id: 'cat-tech',
      name: 'Technology Live',
      category: 'Technology',
      location: 'World',
      url: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_2',
    };
  }
  if (catLower === 'ai') {
    return {
      id: 'cat-ai',
      name: 'AI Intelligence Live',
      category: 'AI',
      location: 'World',
      url: 'https://news.google.com/rss/search?q=(Artificial+Intelligence+OR+Gemini+OR+OpenAI+OR+LLM+OR+DeepSeek)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_1',
    };
  }
  if (catLower === 'startups') {
    return {
      id: 'cat-startups',
      name: 'Startups & Funding Live',
      category: 'Startups',
      location: 'India',
      url: 'https://news.google.com/rss/search?q=(India+startups+OR+venture+funding+OR+unicorn)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_2',
    };
  }
  if (catLower === 'politics') {
    return {
      id: 'cat-politics',
      name: 'Politics & Policy Live',
      category: 'Politics',
      location: 'India',
      url: 'https://news.google.com/rss/search?q=(India+politics+OR+Lok+Sabha+OR+government+policy)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_2',
    };
  }
  if (catLower === 'science') {
    return {
      id: 'cat-science',
      name: 'Science Live',
      category: 'Science',
      location: 'World',
      url: 'https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_2',
    };
  }
  if (catLower === 'space') {
    return {
      id: 'cat-space',
      name: 'ISRO & Space Live',
      category: 'Space',
      location: 'India',
      url: 'https://news.google.com/rss/search?q=(ISRO+OR+NASA+OR+space+mission+OR+Gaganyaan)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_1',
    };
  }
  if (catLower === 'sports') {
    return {
      id: 'cat-sports',
      name: 'Sports Live',
      category: 'Sports',
      location: 'India',
      url: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_2',
    };
  }
  if (catLower === 'entertainment') {
    return {
      id: 'cat-entertainment',
      name: 'Entertainment Live',
      category: 'Entertainment',
      location: 'India',
      url: 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_2',
    };
  }
  if (catLower === 'health' || catLower === 'healthcare') {
    return {
      id: 'cat-health',
      name: 'Health & Medical Live',
      category: 'Health',
      location: 'India',
      url: 'https://news.google.com/rss/headlines/section/topic/HEALTH?hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_2',
    };
  }
  if (catLower === 'education') {
    return {
      id: 'cat-education',
      name: 'Education & Career Live',
      category: 'Education',
      location: 'India',
      url: 'https://news.google.com/rss/search?q=(UPSC+OR+NEET+OR+CBSE+OR+IIT+OR+higher+education+India)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_2',
    };
  }
  if (catLower === 'environment' || catLower === 'climate') {
    return {
      id: 'cat-environment',
      name: 'Environment & Climate Live',
      category: 'Environment',
      location: 'India',
      url: 'https://news.google.com/rss/search?q=(climate+change+OR+renewable+energy+OR+solar+India)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_2',
    };
  }
  if (catLower === 'defence') {
    return {
      id: 'cat-defence',
      name: 'Defence Live',
      category: 'Defence',
      location: 'India',
      url: 'https://news.google.com/rss/search?q=(DRDO+OR+Indian+Army+OR+Indian+Navy+OR+defence+India)+when:24h&hl=en-IN&gl=IN&ceid=IN:en',
      tier: 'tier_1',
    };
  }

  return {
    id: `cat-custom-${catLower.replace(/\s+/g, '-')}`,
    name: `${category} Live`,
    category,
    location: 'India',
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(category + ' news')}+when:24h&hl=en-IN&gl=IN&ceid=IN:en`,
    tier: 'tier_2',
  };
}

export function getStateRssFeed(stateName: string): RssFeedSource {
  return {
    id: `state-${stateName.toLowerCase().replace(/\s+/g, '-')}`,
    name: `${stateName} Live News`,
    category: 'State',
    location: stateName,
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(stateName + ' news')}+when:24h&hl=en-IN&gl=IN&ceid=IN:en`,
    tier: 'tier_2',
  };
}
