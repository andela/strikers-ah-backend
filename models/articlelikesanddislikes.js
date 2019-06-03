module.exports = (sequelize, DataTypes) => {
  const ArticleLikesAndDislikes = sequelize.define(
    'ArticleLikesAndDislikes',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      like_value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {},
  );
  ArticleLikesAndDislikes.saveLike = async (data, likeValue) => {
    let likedObject = null;
    const hasLiked = await ArticleLikesAndDislikes.findOne({ where: data }) || { like_value: '' };
    if (hasLiked.like_value === likeValue) {
      likedObject = await ArticleLikesAndDislikes.destroy({ where: data });
    } else if (hasLiked.like_value === '') {
      likedObject = await ArticleLikesAndDislikes.create({ ...data, like_value: likeValue });
    } else {
      likedObject = await ArticleLikesAndDislikes.update({
        like_value: likeValue,
      }, { where: data, returning: true });
    }
    if (likedObject) {
      return (likedObject[1]) ? likedObject[1][0] : likedObject;
    } throw new Error('Failed to process likes');
  };
  return ArticleLikesAndDislikes;
};
