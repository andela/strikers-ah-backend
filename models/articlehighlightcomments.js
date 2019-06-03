module.exports = (sequelize, DataTypes) => {
  const articleHighLightComments = sequelize.define(
    'articleHighLightComments',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER },
      articleHighlightId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: { type: DataTypes.STRING, allowNull: false },
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
  articleHighLightComments.associate = (models) => {
    articleHighLightComments.belongsTo(models.highlights, {
      foreignKey: 'articleHighlightId',
      onDelete: 'CASCADE',
    });
    articleHighLightComments.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };
  return articleHighLightComments;
};
