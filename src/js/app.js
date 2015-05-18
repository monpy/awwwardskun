// 無名関数で呼ぶとどうなる？
import "babelify/polyfill";
import React from 'react';

import Articles from './components/articles.jsx';
import TumblrWebApiUtils from './utils/tumblr-webapi-utils.js';

TumblrWebApiUtils.getArticleFromOffset();

React.render(
    <Articles />,
    document.getElementById('container')
);
  
