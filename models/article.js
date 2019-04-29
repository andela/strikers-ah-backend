import sequelizeTrasform from 'sequelize-transforms';

const ArticleModel = (sequelize, DataTypes) => {
  const Article = sequelize.define('article', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      onUpdate: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: { len: { args: 5 }, notEmpty: true }
    },
    body: {
      type: DataTypes.TEXT, trim: true, allowNull: false, validate: { len: { args: 255, msg: 'Body needs to be above 255 characters' }, notEmpty: true }
    },
    taglist: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true, defaultValue: [] },
    description: { type: DataTypes.TEXT, trim: true },
    authorid: { type: DataTypes.INTEGER, allowNull: false },
    views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  }, {});

  sequelizeTrasform(Article);
  Article.createArticle = article => Article.create(article);
  Article.getAll = article => Article.findAll(article);
  Article.getOneArticle = slug => Article.findOne({ where: { slug } });
  Article.findArticleSlug = (authorid, slug) => Article.findOne({ where: { authorid, slug } });
  Article.deleteArticle = slug => Article.destroy({ where: { id: slug } });
  Article.getAll = (limit, offset) => Article.findAll({ limit, offset });
  Article.verifyArticle = slug => Article.findOne({ where: { slug } });

  Article.updateFoundArticle = (id, data) => {
    Article.update({
      title: data.title,
      body: data.body,
      slug: data.slug,
      taglist: data.taglist,
      authorid: data.authorid
    }, { where: { id } });
    return data;
  };
  Article.addViewer = id => Article.increment('views', { by: 1, where: { id } });

  Article.getAll = (limit, offset) => Article.findAll({ limit, offset });
  Article.associate = (models) => {
    Article.belongsTo(models.user, {
      foreignKey: 'authorid', onDelete: 'CASCADE'
    });
    Article.hasMany(models.rating, { foreignKey: 'articleSlug', onDelete: 'CASCADE' });
  };
  Article.associate = (models) => {
    Article.hasMany(models.bookmark, {
      foreignKey: 'articleid', onDelete: 'CASCADE'
    });
  };
  return Article;
};
export default ArticleModel;
