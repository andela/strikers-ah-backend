import slugify from 'slugify';
import hasha from 'hasha';
/**
 * This class to maake a slug
 */
class Slug {
  /**
   * @author: Innocent Nkunzi
   * @param {param} strings
   * @returns {*} returns a slug
   */
  constructor(strings) {
    this.strings = strings;
    this.randomNumber = Math.floor(Math.random() * 10000);
    this.randomString = Math.random().toString(36).substr(2, 1);
    this.date = new Date();
    this.slugMaker();
  }

  /**
   * @author: Innocent Nkunzi
   * @returns {*} it returns a slug without an ID
   */
  slugMaker() {
    if (this.strings.length <= 40) {
      return slugify(this.strings);
    }
    const slug = this.strings.substring(0, 40);
    return slugify(slug);
  }

  /**
   * @author: Innocent Nkunzi
   * @returns {*} it returns a full slug with a hashed ID
   */
  returnSlug() {
    const slug = this.slugMaker();
    const thisDate = Date.now().toString();

    let nowHash = hasha(thisDate);
    nowHash = nowHash.substring(0, 7);
    const newSlug = `${slug}-${nowHash}`;
    return newSlug;
  }
}

export default Slug;
