/**
 * Converts the first letter of a string to uppercase.
 *
 * @param {string} str - The input string to be converted.
 * @returns {string} The converted string with the first letter capitalized.
 */
export const capitalStr = (str: string): string => {
  // Check if the string is not empty.
  if (str.length === 0) {
    return str; // If the string is empty, return it unchanged.
  }

  // Convert the first letter to uppercase and concatenate it with the rest of the string.
  return str[0].toUpperCase() + str.substring(1);
};
