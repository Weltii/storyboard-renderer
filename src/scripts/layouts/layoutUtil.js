/**
 * Check if it necessary to add a pagebreak
 * @returns {boolean}
 */
export function shouldAddPageBreak(framesPerPage, counter, maxCounter) {
  return counter == 0 || counter == maxCounter ? false : (counter + 1) % framesPerPage == 0;
}