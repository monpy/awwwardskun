import React from 'react';
import ArticleStore from '../stores/article-stores.js';
import Article from './article.jsx';

function getStateArticleStores() {
  return {
    articles: ArticleStore.getAllArticles(),
    articlesNum: ArticleStore.getArticlesNum()
  };
}

function getArticle(article) {
  return (
    <Article
      article={article}
    />
  );
}

export default class Articles extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = getStateArticleStores();
    ArticleStore.addChangeListener(this.onChange.bind(this));
  }

  getAllArticles() {
    return true;
  }

  componentDidMount() {

  }

  render () {
    var articles = this.state.articles.map(getArticle);
    return (
      <div className='article_wrap'>
        {articles}
      </div>
    )
  }

  onChange() {
    this.setState(getStateArticleStores());
  }
}

