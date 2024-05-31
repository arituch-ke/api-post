/**
 * Random String
 * @param {number} length random string length
 * @returns {string} return random string from length
 */
export function randomString(length: number): string {
  let result: string = '';
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength: number = characters.length;

  for (let i: number = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
