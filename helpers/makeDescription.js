/**
 * @description this class make a descriptionif it is not provided
 */
class Description {
  /**
       *
       * @param {*} title
       * @param {*} body
       */
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }

  /**
     * @author: Innocent Nkunzi
     * @returns {*} it returns a full slug with a hashed ID
     */
  makeDescription() {
    const description = this.title || `${this.body.substring(0, 100)}...`;
    return description;
  }
}
export default Description;
