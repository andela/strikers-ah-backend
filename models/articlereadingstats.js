const ArticleReadingStatsModel = (Sequelize, DataTypes) => {
  const ArticleReadingStats = Sequelize.define('articlereadingstats', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    articleid: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return ArticleReadingStats;
};
export default ArticleReadingStatsModel;
