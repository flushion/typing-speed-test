/**
 * Generates a random integer within the specified range.
 *
 * @param {number} min - Minimum value (inclusive) of the range.
 * @param {number} max - Maximum value (inclusive) of the range.
 * @returns {number} A random integer within the specified range.
 */
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
};
