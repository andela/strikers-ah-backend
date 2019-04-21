import helper from '../helpers/helper';

const UserModel = (Sequelize, DataTypes) => {
  const User = Sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstname: { type: DataTypes.STRING, allowNull: true },
    lastname: { type: DataTypes.STRING, allowNull: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        validation() {
          if (!(this.provider)) {
            if (!(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email))) { throw new Error('Please enter a valid email address'); }
          }
        }
      }
    },
    bio: { type: DataTypes.STRING, allowNull: true, },
    image: { type: DataTypes.TEXT, allowNull: true },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        validation() {
          if (!(this.provider)) {
            const result = helper.validatePassword(this.password);
            if (result !== true) {
              throw new Error(result);
            }
            this.password = helper.hashPassword(this.password);
          }
        }
      },
    },
    provider: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
    provideruserid: { type: DataTypes.STRING, allowNull: true, },
    verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    inapp: { type: DataTypes.BOOLEAN, default: true },
    emailnotify: { type: DataTypes.BOOLEAN, default: true }
  });
  User.so = us => User.findOrCreate({ where: { provideruserid: us.provideruserid }, defaults: us });
  User.associate = (models) => {
    User.hasMany(models.article, {
      foreignKey: 'authorid', onDelete: 'CASCADE'
    });
  };
  User.checkEmail = email => User.findOne({ where: { email } });
  User.resetpassword = (password, id) => User.update({ password }, { where: { id } });
  User.checkUser = username => User.findOne({ where: { username } });
  return User;
};
export default UserModel;
