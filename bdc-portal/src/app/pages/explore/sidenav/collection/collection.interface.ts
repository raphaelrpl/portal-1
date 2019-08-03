/**
 * Feature
 * interface of each Feature
 */
export interface Feature {
    /** id (unique) to layer identification */
    id: string;
    type?: string;
    assets?: Object;
    bbox?: Array<number>;
    links?: Array<Object>;
    geometry?: Object;
    properties?: Object;
}

/**
 * Collection
 * interface of each Collection
 */
export interface Collection {
    name: string;
    features: Feature[];
}
