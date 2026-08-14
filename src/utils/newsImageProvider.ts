import { Category, NewsEvent } from '../types';

interface ImageOption {
  url: string;
  caption: string;
}

const CATEGORY_IMAGES: Record<string, ImageOption[]> = {
  AI: [
    {
      url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
      caption: 'Artificial Intelligence neural network & compute cluster architecture',
    },
    {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      caption: 'Advanced AI algorithmic models and generative technology',
    },
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      caption: 'Digital data visualization and machine learning research',
    },
  ],
  Technology: [
    {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      caption: 'Microchip circuit board and semiconductor hardware innovation',
    },
    {
      url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
      caption: 'High-performance computing and modern tech ecosystem',
    },
    {
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Cybersecurity operations center and global data network',
    },
  ],
  Space: [
    {
      url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=80',
      caption: 'Satellite launching rocket and space exploration mission',
    },
    {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      caption: 'Earth orbit observation and orbital satellite constellation',
    },
    {
      url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
      caption: 'Deep space astronomical survey and planetary observatory',
    },
  ],
  Defence: [
    {
      url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
      caption: 'Defense aviation stealth fighter jet and radar surveillance',
    },
    {
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      caption: 'National security joint operations and defense technology',
    },
  ],
  Education: [
    {
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      caption: 'Higher education university campus and academic study hall',
    },
    {
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      caption: 'Students participating in university research and competitive exams',
    },
  ],
  Infrastructure: [
    {
      url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      caption: 'Renewable solar energy park and green power grid infrastructure',
    },
    {
      url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
      caption: 'Modern high-speed transit and urban industrial corridor',
    },
    {
      url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
      caption: 'Green hydrogen and sustainable industrial development park',
    },
  ],
  India: [
    {
      url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Indian national landmark and government administrative hub',
    },
    {
      url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
      caption: 'New Delhi administrative precinct and official policy briefing',
    },
    {
      url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
      caption: 'Indian cultural heritage and national development initiative',
    },
  ],
  State: [
    {
      url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      caption: 'State governance assembly and regional administrative summit',
    },
    {
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      caption: 'Regional development council meeting and policy announcement',
    },
  ],
  World: [
    {
      url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
      caption: 'International diplomatic summit and global alliance conference',
    },
    {
      url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
      caption: 'Global world affairs assembly and international forum',
    },
  ],
  Business: [
    {
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
      caption: 'Financial market stock exchange trading and corporate growth',
    },
    {
      url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
      caption: 'Global banking, trade commerce, and economic indicators',
    },
  ],
  Economy: [
    {
      url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
      caption: 'National fiscal policy, central banking, and economic report',
    },
  ],
  Science: [
    {
      url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Advanced scientific laboratory analysis and molecular research',
    },
  ],
  Sports: [
    {
      url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      caption: 'Major international sports stadium and tournament championship',
    },
    {
      url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Athletics track, competitive games, and sports arena',
    },
  ],
  Climate: [
    {
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Global climate action, environmental monitoring, and ecology',
    },
  ],
  Healthcare: [
    {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Medical research facility, public health system, and clinical trial',
    },
  ],
  Careers: [
    {
      url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
      caption: 'Professional workforce development and employment recruitment',
    },
  ],
};

const DEFAULT_IMAGES: ImageOption[] = [
  {
    url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Verified live news reporting and media coverage',
  },
  {
    url: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Breaking news coverage and press publication desk',
  },
];

/**
 * Deterministically yields a high-res image option based on event ID, category, or title keywords
 */
export function getNewsImageForEvent(event: Partial<NewsEvent>): ImageOption {
  if (event.imageUrl) {
    return {
      url: event.imageUrl,
      caption: event.imageCaption || 'Press & Media Photo',
    };
  }

  const category = event.category || 'India';
  const options = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['India'] || DEFAULT_IMAGES;

  // Use simple string hash from event.id or title to consistently pick an image option
  const seedString = `${event.id || ''}-${event.eventTitle || ''}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % options.length;
  return options[index];
}
