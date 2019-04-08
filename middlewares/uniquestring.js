/**
 * @author frank harerimana
 * Generate unique username
 */
class Generate {
  /**
     * @param {*} strings
     */
  constructor(strings) {
    this.strings = strings;
    this.randomNumber = Math.floor(Math.random() * 10000);
    this.randomString = Math.random().toString(36).slice(2);
  }

  /**
     * @author frank harerimana
     * @returns { String } username
     */
  getUsername() {
    return this.strings.replace(/\s/g, '-').toLowerCase() + this.randomNumber;
  }
}
export default Generate;
