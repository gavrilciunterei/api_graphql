const Course = require('../models/course');
const User = require('../models/user');

module.exports = {
  Query: {
    async getCourses(obj, { page, limit }, context) {
      console.log(context);
      let courses = Course.find();
      if (page != undefined) {
        courses.limit(limit).skip((page - 1) * limit);
      }
      return await courses;
    },
    async getCourse(obj, { id }) {
      const course = await Course.findById(id);
      return course;
    },
  },
  Mutation: {
    async addCourse(obj, { input, user }, context) {
      //Validacion operacion por operacion, neceista token
      if (!context || context.currentUser) return null;

      const userObject = await User.findById(user);
      const course = new Course({ ...input, user });
      await course.save();
      userObject.courses.push(course);
      await userObject.save();
      return course;
    },
    async updateCourse(obj, { id, input }) {
      const course = await Course.findByIdAndUpdate(id, input);
      return course;
    },

    async deleteCourse(obj, { id }) {
      await Course.findByIdAndDelete(id);
      return {
        message: `El curso con id ${id} fue eliminado`,
      };
    },
  },
  // rellena el campo user si este es pedido
  Course: {
    async user(c) {
      return await User.findById(c.user);
    },
  },
};
