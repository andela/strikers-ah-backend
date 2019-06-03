const ArticleCommentLikerModel = (Sequelize, DataTypes) => {
  const ArticleCommentLiker = Sequelize.define('articlecommentliker', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    commentid: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });
  return ArticleCommentLiker;
};
export default ArticleCommentLikerModel;
