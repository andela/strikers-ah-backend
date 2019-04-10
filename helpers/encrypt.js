import bcrypt from 'bcryptjs';

/**
 * Encription handler
 */
class Encrypt {
  /**
     * @author frank harerimana
     * @param {*} _value
     * @returns {*} value
     */
  constructor(_value) {
    this.value = _value;
    this.salt = bcrypt.genSaltSync(10);
  }

  /**
 * @author frank harerimana
 * encrypting method
 * @returns {*} encrypted value
 */
  encrypt() {
    return bcrypt.hashSync(this.value, this.salt);
  }

  /**
 * @author frank harerimana
 * @param {*} storedValue
 * @returns {*} true or false
 */
  decrypt(storedValue) {
    return bcrypt.compareSync(this.value, storedValue);
  }
}

export default Encrypt;
