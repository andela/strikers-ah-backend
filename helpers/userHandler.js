/* eslint-disable class-methods-use-this */
/**
 * @author frank harerimana
 * userHandler unique username
 */
class userHandler {
  /**
   * @author frank harerimana
   */
  constructor() {
    this.randomNumber = Math.floor(Math.random() * 10000);
    this.randomString = Math.random().toString(36).slice(2);
  }

  /**
     * @author frank harerimana
     * @param { String } name
     * @returns { String } username
     */
  getUsername(name) {
    return name.replace(/\s/g, '-').toLowerCase() + this.randomNumber;
  }

  /**
     * @author Jacques Nyilinkindi
     * @param { String } words
     * @returns { String } string
     */
  removeSpecialCharacters(words) {
    return words.replace(/[^a-zA-Z ]/g, '').trim();
  }

  /**
     * @author Jacques Nyilinkindi
     * @param { String } image
     * @returns { String } string
     */
  largeTwitterImage(image) {
    return image.replace('_normal', '');
  }
}
export default userHandler;
