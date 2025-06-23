import { Category } from '@/types/flash';

export const mockCategories: Category[] = [
  {
    id: 1,
    name: '比特幣',
    slug: 'bitcoin',
    description: 'Bitcoin相關新聞和市場動態',
    wp_category_id: 1,
  },
  {
    id: 2,
    name: '以太坊',
    slug: 'ethereum', 
    description: 'Ethereum網絡和生態系統新聞',
    wp_category_id: 2,
  },
  {
    id: 3,
    name: 'DeFi',
    slug: 'defi',
    description: '去中心化金融協議和項目',
    wp_category_id: 3,
  },
  {
    id: 4,
    name: 'NFT',
    slug: 'nft',
    description: '非同質化代幣和數字藝術',
    wp_category_id: 4,
  },
  {
    id: 5,
    name: '監管政策',
    slug: 'regulation',
    description: '全球加密貨幣監管動態',
    wp_category_id: 5,
  },
  {
    id: 6,
    name: '市場數據',
    slug: 'market-data',
    description: '市場數據和技術分析',
    wp_category_id: 6,
  },
  {
    id: 7,
    name: '鏈上分析',
    slug: 'onchain-analysis',
    description: '區塊鏈數據和鏈上活動分析',
    wp_category_id: 7,
  },
  {
    id: 8,
    name: '項目動態',
    slug: 'project-updates',
    description: '加密貨幣項目最新進展',
    wp_category_id: 8,
  },
]; 