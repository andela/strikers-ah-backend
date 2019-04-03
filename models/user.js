
const UserModel = (sequelize, DataType) => {
  const User = sequelize.define('user', {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true
    },
    firstname: {
      type: DataType.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataType.STRING
    },
    username: {
      type: DataType.STRING,
      allowNull: true,
      unique: true
    },
    email: {
      type: DataType.STRING,
      allowNull: true,
      unique: true,
    },
    bio: {
      type: DataType.STRING,
      allowNull: true,
    },
    password: {
      type: DataType.STRING,
      allowNull: true,
    },
    image: {
      type: DataType.STRING,
      allowNull: true,
    },
    provider: {
      type: DataType.STRING,
      allowNull: false,
    },
    provideruserid: {
      type: DataType.STRING,
      allowNull: true,
    },
  }, {});
  return User;
};

export default UserModel;
