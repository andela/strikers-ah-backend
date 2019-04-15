module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('article', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    taglist: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    authorid: { type: DataTypes.INTEGER, allowNull: false }
  }, {});

  return Article;
};
