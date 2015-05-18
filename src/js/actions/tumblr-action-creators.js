import TumblrAppDispacher from '../dispacher/tumblr-app-dispacher';
import TumblrWebApiUtils from '../utils/tumblr-webapi-utils.js';

import {ActionTypes} from '../constants/tumblr-constants.js';

export default {
  
  addArticle(blogInfo, articles, offset) {
    console.log('creaters : addArticle');
    TumblrAppDispacher.dispatch ({
      actionType: ActionTypes.ADD,
      blogInfo: blogInfo,
      articles: articles,
      offset: offset
    });
  
  },

  orderUtilGetArticleFromOffset(offset) {
    TumblrWebApiUtils.getArticleFromOffset(offset);
  }

}
