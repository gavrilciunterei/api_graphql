const Course = require('../models/course');

module.exports = {
  Query: {
    getCourses(obj, { page, limit }) {
      if (page != undefined) {
        return courses.slice(page * limit, (page + 1) * limit);
      }
      return courses;
    },
    getCourse(obj, { id }) {
      console.log(id);
      return courses.find((course) => id == course.id);
    },
  },
  Mutation: {
    async addCourse(obj, { input }) {
      const course = new Course(input);
      await course.save();
      return course;
    },
    updateCourse(obj, { id, input }) {
      // buscamos el curso que queremos modificar
      const courseIndex = courses.findIndex((course) => id === course.id);
      const course = courses[courseIndex];
      // reemplaza los valores inciales del objeto que está actualizando
      const newCourse = Object.assign(course, { input });
      // guardamos en el arrya el nuevo para sustituir el viejo
      course[courseIndex] = newCourse;

      return newCourse;
    },

    deleteCourse(obj, { id }) {
      courses = courses.filter((course) => course.id != id);
      return {
        message: `El curso con id ${id} fue eliminado`,
      };
    },
  },
};
