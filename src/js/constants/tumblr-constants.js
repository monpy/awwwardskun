import keyMirror from 'keymirror';

export default {

  ActionTypes: keyMirror({
    // API 経由で tumblr の記事をとってくる
    GET_ARTICLE: null,
    // 記事をStoreへ追加する
    ADD: null,
    // 記事を全て削除する
    ALL_REMOVE: null
  })

};