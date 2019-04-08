/* eslint-disable no-useless-escape */
/**
 * This class to maake a slug
 */
class Slug {
  /**
   * @author: Innocent Nkunzi
   * @param {param} text
   * @returns {*} returns a slug maker
   */
  constructor(text) {
    this.text = text;
    this.radomNumber = Math.floor(Math.random() * 1000);
    this.randomString = Math.random().toString(36).substr(2, 1);
    this.randomString2 = Math.random().toString(36).substr(2, 1);
    this.date = new Date();
  }

  /**
   * @author: Innocent Nkunzi
   * @returns {*} it returns full year
   */
  returnFullyear() {
    return this.date.getFullYear().toString().slice(2) + this.randomString;
  }

  /**
   * @author: Innocent Nkunzi
   * @returns {*} it returns full day
   */
  returnDay() {
    return this.date.getDay();
  }

  /**
   * @author: Innocent Nkunzi
   * @returns {*} it returns a day
   */
  returnDAte() {
    return this.date.getDate();
  }

  /**
   * @author: Innocent Nkunzi
   * @returns {*} it returns the hour and concatinates a random string
   */
  returnHours() {
    return this.date.getHours() + this.randomString2;
  }

  /**
   * @author: Innocent Nkunzi
   * @returns {*} it returns minutes
   */
  returnMinute() {
    return this.date.getMinutes();
  }

  /**
  * @param {*} none
  * @returns {*} returns a slug
  */
  slugMaker() {
    return this.text.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }
}

export default Slug;
