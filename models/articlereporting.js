const ArticleReportingModel = (Sequelize, DataTypes) => {
  const ArticleReporting = Sequelize.define('articlereporting', {
    articleid: { type: DataTypes.INTEGER, allowNull: false },
    categoryid: { type: DataTypes.INTEGER, allowNull: false },
    userid: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return ArticleReporting;
};
export default ArticleReportingModel;
