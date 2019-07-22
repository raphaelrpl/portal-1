/**
 * Language
 * interface for each language item
 */
export interface Language {
    /** language id (pt, en) */
    id: string;
    /** language title (visible in component) */
    title: string;
    /** language icon (country flag) */
    icon: string;
}
