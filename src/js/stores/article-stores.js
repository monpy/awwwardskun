import TumblrAppDispacher from '../dispacher/tumblr-app-dispacher';
import {ActionTypes} from '../constants/tumblr-constants.js';
import Emitter from 'component-emitter';
import is from 'is-js';
const SINGLETON_PROP     = Symbol();
const SINGLETON_ENFORCER = Symbol();

var CHANGE_EVENT = 'change';

var _blogData = {};

class ArticleStore extends Emitter {

  constructor( enforcer ) {
    super();
    console.log(enforcer);
    // ArticleStore.instance 以外でインスタンス生成したら例外発生
    if( enforcer != SINGLETON_ENFORCER ) {
        throw new Error( 'Cannot construct singleton' );
    }

    TumblrAppDispacher.register(this.onAction.bind(this));
  }
  
  // instanceを返す。
  // 参照
  //http://stackoverflow.com/questions/26205565/converting-singleton-js-objects-to-use-es6-classes
  static get instance() {
      if( !( this[ SINGLETON_PROP ] ) ) {
          this[SINGLETON_PROP] = new ArticleStore(SINGLETON_ENFORCER);
      }

      return this[SINGLETON_PROP];
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  /**
   * @param {function} callback
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  /**
   * @param {function} callback
   */
  removeChangeListener(callback) {
    this.off(CHANGE_EVENT, callback);
  }

  getArticlesNum() {
    if ( is.empty( _blogData ) ) {
      return 0;
    } else {
      return _blogData.articlesNum;
    }
  }

  // 保存中の記事を全て渡す。
  getAllArticles() {
    console.log('getAllArticles:called')
    // データがない場合
    if ( is.empty( _blogData ) ) {
      return [];
    }
    return _blogData.articles;
  }

  saveData(blogInfo, articles, offset) {
    console.log(blogInfo, articles, offset);

    // localStorage にデータがなければ 新規に作成する
    if (is.empty( localStorage.getItem('blogData') )) {
      return this.createData(blogInfo, articles, offset);
    }

    // _blog data が 空の場合は既存のデータを一旦コピーする
    if ( is.empty(_blogData) ) {
      console.log('_blogData is empty, copy localStorage');
      _blogData = JSON.parse( localStorage.getItem('blogData') );
    }

    console.log(_blogData.updated, blogInfo.updated)

    // post の総数が違う場合
    if ( _blogData.articlesNum != blogInfo.posts ) {
      return this.createData(blogInfo, articles, offset);
    }

    // update の値を比較
    if ( _blogData.updated != blogInfo.updated ) {
      // 全て free にした上で 再度読み込み直し
      
      // offset 0 ならば初期の読み込みなので create に投げる 
      if ( offset == 0 ) {
        return this.createData(blogInfo, articles, offset);
      }

      // そうでない場合は alert を出す？？？
      alert('記事の更新があったので全てリロードされます。');
      return this.createData(blogInfo, articles, offset);

    }

    return this.addDate(blogInfo, articles, offset);
  }



  // local storage にデータがない場合
  // latestupdate の値が一致しない場合
  createData(blogInfo, articles, offset) {
    console.log('createData:');
    // 念のため localStorage を clear

    localStorage.clear();

    _blogData.updated = blogInfo.updated;
    _blogData.articlesNum = blogInfo.posts;
    _blogData.articles = articles;

    // local storage に保存
    localStorage.setItem("blogData", JSON.stringify(_blogData));

  }

  // local storage のデータがあり、updated　の値が一致している
  // 保存されている値の内容と offset を比較し、未取得の記事であれば記事の配列にpushし再保存する
  addDate(blogInfo, articles, offset) {
    console.log('addData...:');
    // 全記事が取得済みならば return
    // 初期の記事は上履きさせようかな？？？
    for (var i = 0; i < articles.length; i++) {
      _blogData.articles[offset + i] = articles[i];
    };

    console.log(_blogData);

    if ( _blogData.articles.length == _blogData.articlesNum ) return;

    // 取得済みの offset であるかどうか比較する
    // offset が既に全記事数を超えている
    if ( _blogData.articlesNum < offset) return;
    // offset が 現在取得済みの記事よりも 少ない( 取得済みである )
    if ( _blogData.articles.length > offset ) return;

    // 取得記事をマージする
    _blogData.articles = _blogData.concat(articles);

    console.log('updated:', _blogData);

    //localStorage の更新
    localStorage.setItem('blogData', _blogData);
  }



  //  action の登録
  onAction(action) {
    switch( action.actionType ) {
      case ActionTypes.ADD:
        console.log('getAction ADD', action);
        this.saveData(action.blogInfo, action.articles, action.offset);
        this.emitChange();
        break;
      default:

        break;
    }
  }

}

export default ArticleStore.instance;
