/**
 * convert date to string with USA template
 * @params {date} Date object
 * @returns date string
 */
export function formatDateUSA(date: Date): string {
    let month: string = (date.getMonth() + 1).toString();
    month = month.toString().length === 1 ? `0${month}` : month;
    let day: string = (date.getDate()).toString();
    day = day.toString().length === 1 ? `0${day}` : day;

    return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * add on month in date
 * @params {date} Date object
 * @returns date
 */
export function addMonth(date: Date): Date {
    return new Date(date.setMonth(date.getMonth() + 1))
}

/**
 * get last day by month
 * @params {date} Date object
 * @returns day
 */
export function getLastDateMonth(date: Date): number {
    const nextMonth = addMonth(new Date(date.setDate(1)));
    const thisMonthDate = new Date(nextMonth.setDate(nextMonth.getDate() - 1));
    return thisMonthDate.getDate();
}