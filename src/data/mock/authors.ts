export interface MockAuthor {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export const mockAuthors: MockAuthor[] = [
  {
    id: 1,
    name: '王小明',
    email: 'wang.xiaoming@kriptosaat.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
  },
  {
    id: 2,
    name: '李小華',
    email: 'li.xiaohua@kriptosaat.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
  },
  {
    id: 3,
    name: '張研究員',
    email: 'zhang.researcher@kriptosaat.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
  },
  {
    id: 4,
    name: '陳分析師',
    email: 'chen.analyst@kriptosaat.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
  },
  {
    id: 5,
    name: '林記者',
    email: 'lin.reporter@kriptosaat.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
  },
  {
    id: 6,
    name: '區塊鏈觀察者',
    email: 'blockchain.observer@kriptosaat.com',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=64&h=64&fit=crop&crop=face',
  },
  {
    id: 7,
    name: 'DeFi專家',
    email: 'defi.expert@kriptosaat.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face',
  },
  {
    id: 8,
    name: '市場編輯',
    email: 'market.editor@kriptosaat.com',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=64&h=64&fit=crop&crop=face',
  },
]; 