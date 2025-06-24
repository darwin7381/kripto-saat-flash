import { Flash } from '@/types/flash';
import { mockCategories } from './categories';
import { mockTags } from './tags';
import { mockAuthors } from './authors';

// 工具函數：隨機選擇數組元素
function randomPick<T>(arr: T[], count: number = 1): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 工具函數：生成隨機時間（最近7天內）
function randomRecentDate(): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));
  return date.toISOString();
}

// 獲取日期
const now = new Date();
const today = new Date(now);
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
const dayBeforeYesterday = new Date(now);
dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

// 設置具體時間
const setTime = (date: Date, hours: number, minutes: number) => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate.toISOString();
};

// 假快訊內容模板（基於競品真實內容）
const flashTemplates = [
  {
    title: 'Metaplanet增持1111枚BTC，總持倉達11111枚',
    content: '據官方公告，日本上市公司Metaplanet宣布增持1111枚比特幣，使其總持倉達到11111枚BTC。該公司表示，此次增持是基於對比特幣長期價值的看好，以及作為對沖通脹的戰略資產配置。Metaplanet成為繼MicroStrategy之後又一積極配置比特幣的上市公司。',
    categories: [1], // 比特幣
    tags: [1, 20], // BTC, MicroStrategy
  },
  {
    title: 'TRC20-USDT發行量突破800億大關，增至806億枚',
    content: 'TRC20-USDT發行量增至806億枚，正式突破800億大關。今年以來，波場網絡已累計增發近210億枚USDT，截至目前，TRC20-USDT占全網USDT總發行量的51.6%，持有帳戶數達6729萬，累計轉帳數超25.94億筆。TRC20-USDT的使用並不局限於新興市場，在發達國家同樣被大量採用。',
    categories: [6], // 市場數據
    tags: [3, 29], // USDT, 穩定幣
  },
  {
    title: '某以太坊巨鯨向Binance轉入20461枚ETH，價值4567萬美元',
    content: '據鏈上分析師監測，2小時前地址「0xD74...11745」將過去5個月從StakeStone和Blast贖回的20461枚ETH全部充值進Binance，價值4567萬美元，疑似清仓。其中9117枚ETH為2023年8月至2024年2月期間以均價2003美元建倉，若賣出將獲利208.7萬美元。',
    categories: [7], // 鏈上分析
    tags: [2, 10, 33], // ETH, Binance, 鯨魚
  },
  {
    title: '中信建投：看好穩定幣產業發展，將對跨境支付產生較大促進',
    content: '中信建投發布報告指出，全球穩定幣政策端與產業端持續發力，產業生態繼續繁榮。加密貨幣及香港地區穩定幣的發展，會對人民幣國際化，以及跨境支付產生較大的促進，建議關注跨境支付相關標的。',
    categories: [5], // 監管政策
    tags: [29, 26], // 穩定幣, 香港
  },
  {
    title: 'Binance Alpha昨日交易量5.31億美元，BR、ROAM、KOGE分列前三',
    content: '6月22日Binance Alpha交易量報5.31億美元，交易量較前幾日繼續小幅下行，創5月12日以來的最低數據。其中，BR交易量3.2億美元，ROAM交易量4285萬美元，KOGE交易量3192萬美元居於前列。',
    categories: [6], // 市場數據
    tags: [10], // Binance
  },
  {
    title: 'CertiK：COSMFinance遭黑客攻击，損失約31萬美元',
    content: '據CertiK監測，COSMFinance項目遭到黑客攻擊。攻擊者通過反覆調用0x062bb125()函數在未經驗證的受害合約上出售多餘的CSM代幣，並通過套利操作獲利約31萬美元。該事件再次提醒DeFi項目需要加強智能合約安全審計。',
    categories: [3], // DeFi
    tags: [7], // 智能合約
  },
  {
    title: '加密市場情緒回歸「中性」，今日恐慌與貪婪指數達47',
    content: '據Alternative數據，今日加密貨幣恐慌與貪婪指數為47（昨日為42），加密市場情緒回歸「中性」。恐慌指數閾值為0-100，包含指標：波動性（25%）＋市場交易量（25%）＋社交媒體熱度（15%）＋市場調查（15%）＋比特幣在整個市場中的比例（10%）＋谷歌熱詞分析（10%）。',
    categories: [6], // 市場數據
    tags: [1], // BTC
  },
  {
    title: '某Hyperliquid交易鯨魚於暴跌期間遭清算，損失超350萬美元',
    content: '據Lookonchain監測，由於市場崩潰，鯨魚0x7e8b持倉規模965枚BTC（9750萬美元）和12,024枚ETH（2622萬美元）的多單被清算，損失超過350萬美元。但他並沒有放棄——在清算之後，他又以40倍多頭倉位BTC重新入場，目前擁有106萬美元的未實現利潤。',
    categories: [7], // 鏈上分析
    tags: [1, 2, 33, 34], // BTC, ETH, 鯨魚, 清算
  },
  {
    title: 'Web3 Harbour與普華永道合作發布「香港Web3藍圖」，聚焦穩定幣及其他關鍵領域',
    content: '據《南華早報》報道，香港Web3行業組織Web3 Harbour與普華永道香港聯合發布「香港Web3藍圖」，聚焦五大關鍵推動因素：人才、市場基礎設施、標準、監管以及資金和經濟貢獻。兩位負責人透露將於8月成立五個行動小組，專注於穩定幣、基金管理、虛擬資產交易平台、法律合規以及託管和場外交易等關鍵領域。',
    categories: [5], // 監管政策
    tags: [30, 26, 29], // Web3, 香港, 穩定幣
  },
  {
    title: '兩鯨魚地址近期共積累1600萬枚IP，價值4752萬美元',
    content: '據Lookonchain監測，近期有2頭鯨魚積累了1600萬IP（4752萬美元）。鯨魚0x9921累計600萬枚IP（1782萬美元）。鯨魚0x9057累計1000萬枚IP（2970萬美元）。大額資金的持續流入顯示市場對該項目的看好情緒。',
    categories: [7], // 鏈上分析
    tags: [33], // 鯨魚
  },
  {
    title: 'LayerZero基金會宣布ZRO代幣分配計劃，社區分配占總量的38.5%',
    content: 'LayerZero基金會正式公布ZRO代幣經濟模型和分配方案。總供應量為10億枚，其中社區分配38.5%（包括空投8.5%），核心貢獻者25.5%，投資者33%，生態基金3%。空投將分多輪進行，首輪面向早期用戶和開發者。',
    categories: [8], // 項目動態
    tags: [28, 36], // Layer2, 空投
  },
  {
    title: 'Ethereum Shanghai升級一週年：質押ETH突破3200萬枚',
    content: 'Ethereum Shanghai升級滿一週年，ETH質押數量已突破3200萬枚，價值超過760億美元，占ETH總供應量的26.7%。流動性質押協議持續增長，Lido佔據32%的市場份額。質押收益率維持在3.2%左右，吸引更多機構投資者參與。',
    categories: [2], // 以太坊
    tags: [2], // ETH
  },
  {
    title: 'Polygon推出Chain Development Kit 2.0，支持零知識證明',
    content: 'Polygon宣布推出Chain Development Kit (CDK) 2.0版本，新增零知識證明功能，讓開發者能夠輕鬆構建與Ethereum兼容的ZK-Rollup。CDK 2.0提供模組化架構，支持自定義gas代幣、治理機制和共識算法。',
    categories: [8], // 項目動態
    tags: [14, 28], // Polygon, Layer2
  },
  {
    title: 'Uniswap V4測試網交易量突破10億美元，創歷史新高',
    content: 'Uniswap V4測試網累計交易量正式突破10億美元大關，創下測試網階段歷史新高。V4版本引入的Hook機制和Gas優化獲得開發者廣泛好評，預計主網上線後將進一步鞏固Uniswap在DEX領域的領導地位。',
    categories: [3], // DeFi
    tags: [6], // Uniswap
  },
  {
    title: 'Base鏈TVL突破75億美元，成為第三大Layer 2網絡',
    content: 'Coinbase推出的Layer 2網絡Base總鎖倉價值(TVL)突破75億美元，正式超越Polygon成為第三大Layer 2網絡，僅次於Arbitrum和Optimism。Base鏈上DeFi生態繁榮發展，用戶數突破500萬。',
    categories: [3], // DeFi
    tags: [17, 28], // Base, Layer2
  },
  {
    title: 'SEC主席：將繼續加強對加密貨幣市場的監管執法',
    content: 'SEC主席Gary Gensler在國會聽證會上表示，委員會將繼續加強對加密貨幣市場的監管執法，重點關注未註冊證券發行和市場操縱行為。他強調投資者保護是SEC的首要任務，呼籲國會盡快通過相關立法。',
    categories: [5], // 監管政策
    tags: [23], // SEC
  },
  {
    title: 'MicroStrategy再次購入3000枚比特幣，持倉總值超過150億美元',
    content: 'MicroStrategy宣布以1.95億美元購入3000枚比特幣，平均價格為65000美元。截至目前，該公司共持有193000枚比特幣，總價值超過150億美元，成為全球持有比特幣最多的上市公司。',
    categories: [1], // 比特幣
    tags: [1, 20], // BTC, MicroStrategy
  },
  {
    title: 'Aave V3部署到BNB Chain，支持跨鏈借貸功能',
    content: 'Aave協議宣布V3版本正式部署到BNB Chain，為用戶提供跨鏈借貸服務。新部署支持BNB、USDT、USDC等主流資產，並引入Portal功能，允許用戶在不同鏈之間無縫轉移資產。',
    categories: [3], // DeFi
    tags: [7, 4], // Aave, BNB
  },
  {
    title: 'OpenSea推出Pro版本，支持高級NFT交易功能',
    content: 'NFT市場龍頭OpenSea推出Pro版本，面向專業交易者和機構用戶。新版本提供批量操作、高級篩選、實時市場數據和API接入等功能。Pro版本採用訂閱制，月費199美元。',
    categories: [4], // NFT
    tags: [], // 暫無特定標籤
  },
  {
    title: '比特幣挖礦難度調整至歷史新高，算力持續增長',
    content: '比特幣網絡挖礦難度在最新調整中達到歷史新高，較上次調整增長4.2%。全網算力持續增長至680 EH/s，顯示礦工對比特幣長期前景保持樂觀。能源效率的提升和新一代挖礦設備的部署推動了算力增長。',
    categories: [1], // 比特幣
    tags: [1], // BTC
  },
];

// 生成假快訊數據
export const mockFlashes: Flash[] = Array.from({ length: 100 }, (_, index) => {
  const template = flashTemplates[index % flashTemplates.length];
  const author = randomPick(mockAuthors, 1)[0];
  
  // 設置發布時間
  let publishedAt: string;
  if (index < 5) {
    // 前5條是今天的
    const hours = 16 - index * 2; // 16:00, 14:00, 12:00, 10:00, 8:00
    publishedAt = setTime(today, hours, Math.floor(Math.random() * 60));
  } else if (index < 10) {
    // 接下來5條是昨天的
    const hours = 22 - (index - 5) * 3; // 22:00, 19:00, 16:00, 13:00, 10:00
    publishedAt = setTime(yesterday, hours, Math.floor(Math.random() * 60));
  } else if (index < 15) {
    // 再接下來5條是前天的
    const hours = 20 - (index - 10) * 3; // 20:00, 17:00, 14:00, 11:00, 8:00
    publishedAt = setTime(dayBeforeYesterday, hours, Math.floor(Math.random() * 60));
  } else {
    // 其餘的使用隨機日期
    publishedAt = randomRecentDate();
  }
  
  // 隨機設置某些快訊為重要（約20%的機率）
  const isImportant = Math.random() < 0.2;
  
  return {
    id: index + 1,
    title: template.title,
    content: template.content,
    excerpt: template.content.slice(0, 150) + '...',
    slug: `flash-${index + 1}-${template.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')}`,
    published_at: publishedAt,
    updated_at: publishedAt,
    author: {
      id: author.id,
      name: author.name,
      email: author.email,
    },
    categories: template.categories.map(id => mockCategories.find(c => c.id === id)!),
    tags: randomPick(mockTags, Math.floor(Math.random() * 4) + 1), // 1-4個隨機標籤
    featured_image: Math.random() > 0.6 ? {
      url: `https://picsum.photos/800/400?random=${index + 1}`,
      alt: template.title,
      width: 800,
      height: 400,
    } : undefined,
    meta: {
      views: Math.floor(Math.random() * 10000) + 100,
      reading_time: Math.floor(Math.random() * 5) + 1,
    },
    isImportant: isImportant,
  };
});

// 按ID降序排列（最新的在前面）
mockFlashes.sort((a, b) => b.id - a.id); 