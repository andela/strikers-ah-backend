const ArticleReadingStatsModel = (Sequelize, DataTypes) => {
  const ArticleReadingStats = Sequelize.define('articlereadingstats', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    articleid: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  ArticleReadingStats.getUserHistory = async (userId) => {
    const result = await Sequelize.query(
      `SELECT articlereadingstats.*, articles.title FROM articlereadingstats, articles WHERE articlereadingstats.userid = ${userId} AND articles.authorid = articlereadingstats.userid AND articlereadingstats.articleid = articles.id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    return result;
  };
  return ArticleReadingStats;
};
export default ArticleReadingStatsModel;
