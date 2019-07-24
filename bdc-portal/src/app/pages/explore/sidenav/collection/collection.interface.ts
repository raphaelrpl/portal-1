/**
 * Collection
 * interface of each Collection
 */
export interface Collection {
    /** id (unique) to layer identification */
    id: string;
    type?: string;
    assets?: Object;
    bbox?: Array<number>;
    links?: Array<Object>;
    geometry?: Object;
    properties?: Object;
}
