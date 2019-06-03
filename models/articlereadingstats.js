const ArticleReadingStatsModel = (Sequelize, DataTypes) => {
  const ArticleReadingStats = Sequelize.define('articlereadingstats', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    articleid: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });
  ArticleReadingStats.readingStats = async (type, id) => {
    let query = `SELECT articlereadingstats.*, articles.title FROM articlereadingstats, articles WHERE articlereadingstats.userid = ${id} AND articles.authorid = articlereadingstats.userid AND articlereadingstats.articleid = articles.id`;
    if (type === 'article') {
      query = `SELECT articlereadingstats.*, users.username FROM articlereadingstats, users WHERE articlereadingstats.articleid = ${id} AND articlereadingstats.userid = users.id`;
    }
    const result = await Sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
    return result;
  };
  return ArticleReadingStats;
};
export default ArticleReadingStatsModel;
