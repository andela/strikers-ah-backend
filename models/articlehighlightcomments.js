const ArticleHighlightCommentModel = (Sequelize, DataTypes) => {
  const ArticleHighlightComment = Sequelize.define('articlehighlightcomment', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    articleid: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false },
    positionleft: { type: DataTypes.STRING, allowNull: false },
    positiontop: { type: DataTypes.STRING, allowNull: false },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });
  return ArticleHighlightComment;
};
export default ArticleHighlightCommentModel;
