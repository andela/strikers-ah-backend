const ArticleReportingModel = (Sequelize, DataTypes) => {
  const ArticleReporting = Sequelize.define('articlereporting', {
    articleid: { type: DataTypes.INTEGER, allowNull: false },
    categoryid: { type: DataTypes.INTEGER, allowNull: false },
    userid: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  ArticleReporting.reportedArticles = async () => {
    const result = await Sequelize.query(
      `SELECT articlereporting.id, articlereporting.description, reportingcategory.name,
       articles.id as articleid, articles.title, articles.slug FROM articlereporting, reportingcategory,
       articles WHERE articlereporting.articleid = articles.id AND articlereporting.categoryid = reportingcategory.id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    return result;
  };
  return ArticleReporting;
};
export default ArticleReportingModel;
