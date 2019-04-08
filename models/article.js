module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('article', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: { name: 'article_slug', msg: 'An article with this id already exist' } },
    title: { type: DataTypes.STRING, llowNull: false, required: true },
    body: { type: DataTypes.TEXT, allowNull: false },
    taglist: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    description: { type: DataTypes.TEXT, allowNull: false },
    authorid: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, required: true, defaultValue: new Date() },
    updatedAt: { type: DataTypes.DATE, required: true, defaultValue: new Date() },
  }, {});
  // Article.associate = function (models) {
  //   // associations can be defined here
  // };
  return Article;
};
