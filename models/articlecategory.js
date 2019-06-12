const ArticleCategoryModel = (Sequelize, DataTypes) => {
  const ArticleCategory = Sequelize.define('articlecategory', {
    name: { type: DataTypes.STRING, allowNull: false },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });
  return ArticleCategory;
};
export default ArticleCategoryModel;
