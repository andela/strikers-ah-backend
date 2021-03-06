/* eslint-disable arrow-parens */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable camelcase */
import helper from '../helpers/helper';

const UserModel = (Sequelize, DataTypes) => {
  const User = Sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstname: { type: DataTypes.STRING, allowNull: true },
    lastname: { type: DataTypes.STRING, allowNull: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        validation() {
          if (!this.provider) {
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email)) {
              throw new Error('Please enter a valid email address');
            }
          }
        }
      }
    },
    bio: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.TEXT, allowNull: true },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        validation() {
          if (!this.provider) {
            const result = helper.validatePassword(this.password);
            if (result !== true) {
              throw new Error(result);
            }
            this.password = helper.hashPassword(this.password);
          }
        }
      }
    },
    provider: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
    provideruserid: { type: DataTypes.STRING, allowNull: true },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    inapp_notifications: { type: DataTypes.BOOLEAN, defaultValue: true },
    email_notifications: { type: DataTypes.BOOLEAN, defaultValue: true },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'User' }
  });
  User.socialUsers = async userProfile => {
    //
    const { email } = userProfile;
    if (email) {
      const userInfo = await User.findOne({ where: { email } });
      if (userInfo) {
        const userId = userInfo.id;
        //
        const { provider } = userProfile;
        const { provideruserid } = userProfile;
        const result = await User.update({ provider, provideruserid }, { where: { id: userId }, returning: true });
        return result[1][0].dataValues;
      }
    }
    //
    const result = await User.findOrCreate({
      where: { provideruserid: userProfile.provideruserid },
      defaults: userProfile
    });
    return result[0].dataValues;
  };
  User.checkEmail = email => User.findOne({ where: { email } });
  User.resetpassword = (password, id) => User.update({ password }, { where: { id } });
  User.checkUser = username => User.findOne({ where: { username } });
  User.findUser = id => User.findOne({ where: { id } });
  User.emailNotifications = (id, email_notifications) => User.update({ email_notifications }, { where: { id } });
  User.checkuserExistance = authorid => User.findOne({
      attributes: {
        exclude: [
          'id',
          'firstname',
          'lastname',
          'email',
          'password',
          'provider',
          'provideruserid',
          'verified',
          'inapp_notifications',
          'email_notifications',
          'createdAt',
          'updatedAt'
        ]
      },
      where: { id: authorid }
    });
  User.associate = models => {
    User.hasMany(models.bookmark, {
      foreignKey: 'userid',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.article, {
      foreignKey: 'authorid',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.notifications, {
      foreignKey: 'userid',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.following, {
      foreignKey: 'userid',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.followers, {
      foreignKey: 'userid',
      onDelete: 'CASCADE'
    });
  };
  User.allUsers = async () => User.findAll({ attributes: ['username', 'bio', 'image', 'role'] });
  User.singleUser = async username => User.findOne({
      attributes: ['username', 'bio', 'image', 'role'],
      where: { username }
    });
  User.verifyUser = id => User.findOne({ where: { id } });
  User.checkEmail = email => User.findOne({ where: { email } });
  User.resetpassword = (password, id) => User.update({ password }, { where: { id } });
  User.checkUser = username => User.findOne({ where: { username } });
  User.findUser = id => User.findOne({ where: { id } });
  User.checkuser = authorid => User.findOne({ where: { id: authorid } });
  return User;
};
export default UserModel;
