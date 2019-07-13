/**
 * Language
 * interface for each language item 
 * @param {string} id language id (pt, en)
 * @param {string} title 
 * @param {string} icon language icon (country flag)
 */
export interface Language {
    /** language id (pt, en */
    id: string;
    /** language title (visible in component) */
    title: string;
    /** language icon (country flag) */
    icon: string;
}
