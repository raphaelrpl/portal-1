/**
 * interface to cube metadata
 */
export interface CubeMetadata {
    /** bands */
    bands: string;
    /** name */
    datacube: string;
    /** end date */
    end: string;
    /** start date */
    start: string;
    /** id */
    id: number;
    /** bands to composite quicklook */
    quicklook: string;
    /** resolution x */
    resx: number;
    /** resolution y */
    resy: number;
    /** sattelite / sensor */
    satsen: string;
    /** temporal step */
    step: number;
    /** temporal schema (monthly, sazonal, ...) */
    tschema: string;
    /** grid name (GRS) */
    wrs: string;
}
