const ArticleCommentLikerModel = (Sequelize, DataTypes) => {
  const ArticleCommentLiker = Sequelize.define('articlecommentliker', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    commentid: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });
  ArticleCommentLiker.commentLikers = async (commentId) => {
    let result = await Sequelize.query(
      `SELECT users.username FROM users, articlecommentliker WHERE users.id = articlecommentliker.userid AND articlecommentliker.commentid = ${commentId}`,
      { type: Sequelize.QueryTypes.SELECT },
    );
    result = result.map(user => user.username);
    return result;
  };
  return ArticleCommentLiker;
};
export default ArticleCommentLikerModel;
