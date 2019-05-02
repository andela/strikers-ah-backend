/* eslint-disable class-methods-use-this */
import { EventEmitter } from 'events';
import userNotification from '../controllers/userNotification';

/**
 * notification handler
 */
class UserEvents extends EventEmitter {
  /**
     * @author frank harerimana
     * @param {*} userid
     * @returns {*} call notification controller
     */
  verifyingAccount(userid) {
    userNotification.userVerifiedAccount(userid);
    return 'success';
  }

  /**
   * @author frank harerimana
   * @param {*} id
   * @returns {*} success
   */
  resetpassword(id) {
    userNotification.resetpassword(id);
    return id;
  }
}

export default UserEvents;
