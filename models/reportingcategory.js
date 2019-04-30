const ReportingCategoryModel = (Sequelize, DataTypes) => {
  const ReportingCategory = Sequelize.define('reportingcategory', {
    name: { type: DataTypes.STRING, allowNull: false }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return ReportingCategory;
};
export default ReportingCategoryModel;
