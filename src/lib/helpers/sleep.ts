/**
 * Promisified setTimeout to pause execution.
 *
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the specified time.
 */
const sleep = ( ms: number ): Promise<void> => {
  return new Promise( ( resolve ) => {
    return setTimeout(
      resolve, ms 
    );
  } );
};

export default sleep;
