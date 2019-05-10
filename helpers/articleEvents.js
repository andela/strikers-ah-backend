/* eslint-disable class-methods-use-this */
import { EventEmitter } from 'events';
import notification from '../controllers/notifications';

/**
 * notification handler
 */
class ArticleEvents extends EventEmitter {
  /**
     * @author frank harerimana
     * @param {*} args
     * @param {*} slug
     * @returns {*} call notification controller
     */
  create(args) {
    notification.createArticle(args.authorid, args.slug);
    return 'success';
  }
}

export default ArticleEvents;
