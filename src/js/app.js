// 無名関数で呼ぶとどうなる？
import "babelify/polyfill";
import React from 'react';
import Jsonp from 'jsonp';

import Articles from './components/articles.jsx';
import TumblrWebApiUtils from './utils/tumblr-webapi-utils.js';

console.log(TumblrWebApiUtils);

TumblrWebApiUtils.getArticleFromOffset();


React.render(
    <Articles />,
    document.getElementById('container')
);
  
