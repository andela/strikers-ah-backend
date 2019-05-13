const RoleAssignmentModel = (Sequelize, DataTypes) => {
  const RoleAssignment = Sequelize.define('roleassignment', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    assignedby: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return RoleAssignment;
};
export default RoleAssignmentModel;
