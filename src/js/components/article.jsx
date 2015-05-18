import React from 'react';
import is from 'is-js';

export default class Article extends React.Component {
  
  constructor(props) {
    super(props);
  }

  getImage( article ) {
    if (is.empty( article.photos) ) {
      return (
        <div className='no_image' ref="no_image">
          <a href={article.url} target="_blank">
            <p>
              No Image - {article.url}
            </p>
          </a>
        </div>
      )
    } else {
      var imageUrl = article.photos[0].alt_sizes[2].url;
      return (
        <a href={article.url} target="_blank">
          <img src={imageUrl} alt={article.title} ref="image" />
        </a>
      )
    }
  }

  componentDidMount() {
    console.log('mount!!!');
    if ( is.empty(this.refs.image) ) {
      let h2H = this.refs.h2.getDOMNode().clientHeight + 52;
      this.refs.text_area.getDOMNode().style.height = (200 - h2H) + 'px';
    } else {
      this.refs.image.getDOMNode().onload = this.afterImageLoaded.bind(this);
    }
  }



  afterImageLoaded() {
    console.log(this);
    let imgH = this.refs.image.getDOMNode().clientHeight;
    let h2H = this.refs.h2.getDOMNode().clientHeight + 52;
    this.refs.text_area.getDOMNode().style.height = (imgH - h2H) + 'px';
  }

  render() {
    // ここに記事のタイプ毎にスイッチさせて良い。
    var image = this.getImage(this.props.article)
    return (
      <article>
        <div className="site_image">
          {image}
        </div>
        <div className="impressions">
          <h2 ref="h2">
            {this.props.article.title}
          </h2>
          <div className="text_area" dangerouslySetInnerHTML={{__html: this.props.article.description}} ref="text_area" />
        </div>
      </article>
    )
  }
}

Article.propsType = { article: React.PropTypes.object };