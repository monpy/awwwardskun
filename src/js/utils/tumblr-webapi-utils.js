import TumblrActionCreators from '../actions/tumblr-action-creators.js';
import Jsonp from 'jsonp';

const API_KEY = "OS0vQFI34ApCpzotYawx3Pm76YRTgr3yETJWWYoz99glon6kOr";
const BASE_URL = "http://api.tumblr.com/v2/blog/awwwardkun.tumblr.com/posts";

export default {
  // get some message
  // set offset and can get 20 article

  getArticleFromOffset: function(offset = 0) {
    let url = BASE_URL + '?api_key=' + API_KEY + '&offset=' + offset;
    Jsonp(url, {} , function(err, res) {
      console.log(err, res);
      var blogInfo = res.response.blog;
      var articles = res.response.posts;
      // blog の情報 , articles(Array) を送る
      TumblrActionCreators.addArticle(blogInfo, articles, offset);
    });
  }
 
}