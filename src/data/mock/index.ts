// 統一導出所有Mock數據
export { mockCategories } from './categories';
export { mockTags } from './tags';
export { mockAuthors, type MockAuthor } from './authors';
export { mockFlashes } from './flashes';
export { MockApiService, mockApiService } from './api';

// 統一的Mock模式配置 - 以生產端 MOCK_MODE_ENABLED 為準
export const MOCK_MODE = {
  enabled: process.env.MOCK_MODE_ENABLED === 'true',
}; 