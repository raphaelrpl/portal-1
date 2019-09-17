/**
 * Infos of the activity by cube
 */
export interface Activity {
    /** action type */
    action: string;
    /** cube name */
    cube: string;
    /** tile id */
    tileid: string;
    /** period temporal (start date / end date) */
    period: string;
}
