// Header 相關類型定義

export interface HeaderMedia {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface DropdownItem {
  id: number;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  isExternal: boolean;
  openInNewTab: boolean;
  order: number;
  isActive: boolean;
  badge?: string;
  cssClass?: string;
}

export interface NavigationItem {
  text: string;
  url: string;
  hasDropdown?: boolean;
  children?: DropdownItem[];
}

export interface TopBarSettings {
  enableTopBar: boolean;
  backgroundColor: string;
  height: string;
  htmlContent: string;
}

export interface LogoImage {
  url: string;
  alt?: string;
}

export interface HeaderData {
  logoText: string;
  logoUrl: string;
  logoLight?: LogoImage;  // 白日版 Logo
  logoDark?: LogoImage;   // 暗夜版 Logo
  mainNavigation: NavigationItem[];
  enableSearch: boolean;
  searchPlaceholder: string;
  topBar: TopBarSettings;
}

export interface HeaderResponse {
  data: HeaderData;
  error?: string;
} 