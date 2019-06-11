const ArticleCommentModel = (Sequelize, DataTypes) => {
  const ArticleComment = Sequelize.define('articlecomment', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    articleid: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.STRING, allowNull: false },
    likes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });
  ArticleComment.listComments = async (articleId, type) => {
    const ordering = (type === 'popular') ? 'ORDER BY articlecomment.likes DESC' : 'ORDER BY articlecomment.id DESC';
    const result = await Sequelize.query(
      `SELECT users.id AS userid, users.username, users.bio, users.image, articlecomment.* FROM users, articlecomment WHERE users.id = articlecomment.userid AND articlecomment.articleid = ${articleId} ${ordering}`,
      { type: Sequelize.QueryTypes.SELECT },
    );
    return result;
  };
  ArticleComment.singleComment = async (articleId, commentId) => {
    const result = await Sequelize.query(
      `SELECT articlecomment.*, articles.authorid AS articleauthor FROM articlecomment, articles WHERE articlecomment.id = ${commentId} AND articlecomment.articleid = ${articleId} AND articles.id = articlecomment.articleid`,
      { type: Sequelize.QueryTypes.SELECT },
    );
    return result;
  };
  return ArticleComment;
};
export default ArticleCommentModel;
