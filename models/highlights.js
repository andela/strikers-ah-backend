module.exports = (sequelize, DataTypes) => {
  const highlights = sequelize.define(
    'highlights',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userid: { type: DataTypes.INTEGER },
      articleid: { type: DataTypes.INTEGER },
      startposition: { type: DataTypes.INTEGER },
      endposition: { type: DataTypes.INTEGER },
      textcontent: { type: DataTypes.STRING },
      highlighted: { type: DataTypes.BOOLEAN },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {}
  );
  highlights.associate = (models) => {
    highlights.belongsTo(models.article, { foreignKey: 'articleid', onDelete: 'CASCADE' });
    highlights.belongsTo(models.user, { foreignKey: 'userid', onDelete: 'CASCADE' });
    highlights.hasMany(models.articleHighLightComments, {
      foreignKey: 'articleHighlightId',
      onDelete: 'CASCADE'
    });
  };
  return highlights;
};
