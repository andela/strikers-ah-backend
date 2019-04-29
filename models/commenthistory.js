const CommentHistoryModel = (Sequelize, DataTypes) => {
  const CommentHistory = Sequelize.define('commenthistory', {
    commentid: { type: DataTypes.INTEGER, allowNull: false },
    oldcomment: { type: DataTypes.STRING, allowNull: false }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return CommentHistory;
};
export default CommentHistoryModel;
