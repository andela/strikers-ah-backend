const ArticleReportModel = (Sequelize, DataTypes) => {
  const ArticleReport = Sequelize.define('articlereport', {
    articleid: { type: DataTypes.INTEGER, allowNull: false },
    categoryid: { type: DataTypes.INTEGER, allowNull: false },
    userid: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return ArticleReport;
};
export default ArticleReportModel;
