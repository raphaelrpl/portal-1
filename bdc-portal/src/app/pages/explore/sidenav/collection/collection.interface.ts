/**
 * Feature
 * interface of each Feature
 */
export interface Feature {
    /** id (unique) to layer identification */
    id: string;
    type?: string;
    assets?: object;
    bbox?: Array<number>;
    links?: Array<object>;
    geometry?: object;
    properties?: object;
}

/**
 * Collection
 * interface of each Collection
 */
export interface Collection {
    name: string;
    features: Feature[];
}
