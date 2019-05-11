/**
 * @description this class make a descriptionif it is not provided
 */
class Description {
  /**
       *
       * @param {*} description
       * @param {*} body
       */
  constructor(description, body) {
    this.description = description;
    this.body = body;
  }

  /**
     * @author: Innocent Nkunzi
     * @returns {*} it returns a full slug with a hashed ID
     */
  makeDescription() {
    const description = this.description || `${this.body.substring(0, 100)}...`;
    return description;
  }
}
export default Description;
