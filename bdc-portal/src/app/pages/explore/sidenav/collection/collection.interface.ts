/**
 * Feature
 * interface of each Feature (basead in STAC ITEM)
 */
export interface Feature {
    /** id (unique) to layer identification */
    id: string;
    /** type returned by STAC response */
    type?: string;
    /** assets returned by STAC response */
    assets?: object;
    /** bbox returned by STAC response */
    bbox?: Array<number>;
    /** links returned by STAC response */
    links?: Array<object>;
    /** geometry returned by STAC response */
    geometry?: object;
    /** properties returned by STAC response */
    properties?: object;
}

/**
 * Collection
 * interface of each Collection
 */
export interface Collection {
    /** name of cube */
    name: string;
    /** cube items */
    features: Feature[];
}
