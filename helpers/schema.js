import joi from 'joi';

const Schema = {
  signUpSchema: joi.object().keys({
    firstname: joi.string().min(3).required(),
    lastname: joi.string().min(3).required(),
    email: joi.string().email().required(),
    username: joi.string().min(5).required(),
    password: joi.string().min(8).max(36).regex(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
      .required(),
    bio: joi.string().min(3),
    image: joi.string().min(4),

  }),
  loginSchema: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
  }),
  option: { allowUnknown: false }
};

export default Schema;
