import Joi from 'joi';

export default {
  users: Joi.object({
    id: Joi.string().pattern(new RegExp('^[a-z0-9]{4,15}$')).required(),
    password: Joi.string().min(4).max(40).required(),
    email: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'))
      .required(),
  }),
};
