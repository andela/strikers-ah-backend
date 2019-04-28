const ArticleCommentLikerModel = (Sequelize, DataTypes) => {
  const ArticleCommentLiker = Sequelize.define('articlecommentliker', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    articleid: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.STRING, allowNull: false }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return ArticleCommentLiker;
};
export default ArticleCommentLikerModel;
