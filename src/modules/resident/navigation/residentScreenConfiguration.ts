/**
 * Resident Screen Layout & Navigation Configuration
 * Centralized, strongly-typed configuration for resident top navigation
 */

export interface ResidentScreenLayoutOptions {
  /** Whether the shared top navigation header is visible on this screen */
  showHeader?: boolean;
}

export const residentScreenDefaults: Required<ResidentScreenLayoutOptions> = {
  showHeader: true,
};

export function isScreenHeaderVisible(options?: ResidentScreenLayoutOptions & { headerShown?: boolean }): boolean {
  if (options?.showHeader !== undefined) {
    return options.showHeader;
  }
  if (options?.headerShown !== undefined) {
    return options.headerShown;
  }
  return residentScreenDefaults.showHeader;
}

