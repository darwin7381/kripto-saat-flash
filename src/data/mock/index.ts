// 統一導出所有Mock數據
export { mockCategories } from './categories';
export { mockTags } from './tags';
export { mockAuthors, type MockAuthor } from './authors';
export { mockFlashes } from './flashes';
export { MockApiService, mockApiService } from './api';

// 快速切換Mock模式的配置
export const MOCK_MODE = {
  enabled: process.env.NODE_ENV === 'development' || process.env.USE_MOCK_DATA === 'true',
  // 可以通過環境變數 USE_MOCK_DATA=true 強制啟用Mock模式
}; 