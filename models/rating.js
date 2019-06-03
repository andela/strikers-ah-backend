module.exports = (sequelize, DataTypes) => {
  const rating = sequelize.define('rating', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    articleSlug: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'article',
        key: 'slug',
      },
      onDelete: 'CASCADE',
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }, {});

  rating.addRate = (rate, article, id) => rating.findOrCreate({
    where: { userId: id, articleSlug: article },
    defaults: { rating: rate },
  });

  rating.rateUpdate = (rateId, rate) => rating.update({
    rating: rate,
  },
  {
    returning: true,
    where: { id: rateId },
  });

  rating.avgFind = (slug, articleModel) => rating.findAll({
    where: { articleSlug: slug },
    include: [{
      model: articleModel,
      on: { '$article.slug$': { $col: 'rating.articleSlug' } },
      attributes: ['title'],
    },
    ],
    attributes: ['articleSlug', [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
    group: ['article.id', 'rating.articleSlug'],
  });

  rating.allRatings = (userModel, articleModel, slug) => rating.findAndCountAll({
    where: { articleSlug: slug },
    attributes: ['rating'],
    include: [{
      model: userModel,
      attributes: ['id', 'firstname', 'lastname', 'username'],
    },
    ],
  });
  rating.paginateArticleRatings = (limit, offset) => rating.findAll({ limit, offset });
  rating.associate = (models) => {
    rating.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'CASCADE' });
    rating.belongsTo(models.article, { foreignKey: 'articleSlug', onDelete: 'CASCADE' });
  };

  return rating;
};
