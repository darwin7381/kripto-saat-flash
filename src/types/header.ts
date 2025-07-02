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
  id: number;
  title: string;
  url?: string;
  isExternal: boolean;
  openInNewTab: boolean;
  icon?: string;
  badge?: string;
  order: number;
  isActive: boolean;
  hasDropdown: boolean;
  dropdownItems?: DropdownItem[];
  cssClass?: string;
}

export interface TopBar {
  id: number;
  enableTopBar: boolean;
  htmlContent?: string;
  backgroundColor: string;
  height: string;
  cssClass?: string;
}

export interface Header {
  id: number;
  documentId: string;
  logoLight?: HeaderMedia;
  logoDark?: HeaderMedia;
  logoText: string;
  logoUrl: string;
  logoAltText: string;
  mainNavigation: NavigationItem[];
  enableSearch: boolean;
  searchPlaceholder: string;
  topBar?: TopBar;
  enableDarkMode: boolean;
  stickyHeader: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface HeaderResponse {
  data: Header;
  meta: Record<string, unknown>;
} 