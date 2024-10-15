/**
 * Converts a number to a string with a leading zero if the number is less than 10.
 *
 * @param {number} n - The number to convert.
 * @return {string} The converted string.
 */
export const addZero = (n: number): string => (n < 10 ? `0${n}` : n).toString();
