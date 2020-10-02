const User = require('../models/user');
const Course = require('../models/course');

module.exports = {
  Query: {
    async getUsers() {
      return await User.find();
    },
    async getUser(obj, { id }) {
      return await User.findById(id);
    },
  },
  Mutation: {
    async signUp(obj, { input }) {
      const user = new User(input);
      await user.save();
      return user;
    },
  },
  User: {
    //u es el padre
    async courses(u) {
      return await Course.find({ user: u.id });
    },
  },
};
