/**
 * Temporarily hidden retailer dashboard routes.
 * Remove a path from this list (or clear the array) to restore sidebar access.
 * Routes, pages, and APIs remain intact — only UI visibility is affected.
 */
export const TEMPORARILY_HIDDEN_SIDEBAR_ROUTES = [
  '/programs',
  '/scan',
  '/customers',
  '/activity',
];

export function isSidebarRouteVisible(href) {
  return !TEMPORARILY_HIDDEN_SIDEBAR_ROUTES.includes(href);
}

export function isRouteTemporarilyHidden(pathname) {
  return TEMPORARILY_HIDDEN_SIDEBAR_ROUTES.includes(pathname);
}
