
module.exports = (sequelize, DataTypes) => {
  const rating = sequelize.define('rating', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
<<<<<<< HEAD
<<<<<<< HEAD
    articleSlug: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'article',
        key: 'slug'
      },
      onDelete: 'CASCADE'
=======
    articleId: {
      type: DataTypes.INTEGER,
=======
    articleSlug: {
      type: DataTypes.STRING,
>>>>>>> get user from token
      allowNull: false
>>>>>>> add rating models
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

  }, {});

<<<<<<< HEAD
<<<<<<< HEAD
  rating.addRate = (rate, article, id) => rating.findOrCreate({
    where: { userId: id, articleSlug: article },
    defaults: { rating: rate }
  });

  rating.rateUpdate = (rateId, rate) => rating.update({
    rating: rate
  },
  {
    returning: true,
    where: { id: rateId }
  });

  rating.avgFind = (slug, articleModel) => rating.findAll({
    where: { articleSlug: slug },
    include: [{
      model: articleModel,
      on: { '$article.slug$': { $col: 'rating.articleSlug' } },
      attributes: ['title']
    }
    ],
    attributes: ['articleSlug', [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
    group: ['article.id', 'rating.articleSlug']
  });

  rating.allRatings = (userModel, articleModel, slug) => rating.findAndCountAll({
    where: { articleSlug: slug },
    attributes: ['rating'],
    include: [{
      model: userModel,
      attributes: ['id', 'firstname', 'lastname', 'username']
    }
    ],
  });

  rating.associate = (models) => {
    rating.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'CASCADE' });
    rating.belongsTo(models.article, { foreignKey: 'articleSlug', onDelete: 'CASCADE' });
=======
  rating.rateCheck = (rate, article, id) => rating.findOrCreate({ where: { userId: id, articleId: article }, defaults: { rating: rate } });
=======
  rating.rateCheck = (rate, article, id) => rating.findOrCreate({ where: { userId: id, articleSlug: article }, defaults: { rating: rate } });
>>>>>>> get user from token
  rating.rateUpdate = (rateId, rate) => rating.update({ rating: rate }, { returning: true, where: { id: rateId } });
  rating.avgFind = id => rating.findAll({ where: { articleId: id }, attributes: ['articleId', [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']], group: 'rating.articleId' });
  rating.associate = (models) => {
    rating.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'CASCADE' });
<<<<<<< HEAD
    rating.belongsTo(models.article, { foreignKey: 'articleId', onDelete: 'CASCADE' });
>>>>>>> add rating models
=======
    rating.belongsTo(models.article, { foreignKey: 'articleSlug', onDelete: 'CASCADE' });
>>>>>>> get user from token
  };

  return rating;
};
