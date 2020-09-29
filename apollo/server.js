const { ApolloServer } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
let courses = require('./courses');

const typeDefs = `
  type Course{
    id: ID!
    title: String!
    views: Int
  }
  input CourseInput{
    title: String!
    views: Int
  }
  type Alert{
    message: String
  }
  type Query{
    getCourses(page: Int, limit: Int = 1) : [Course]
    getCourse(id: ID!): Course
  }
  type Mutation{
    addCourse(input: CourseInput): Course
    updateCourse(id: ID!, input: CourseInput): Course
    deleteCourse(id: ID!):Alert
  }
`;

const resolvers = {
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
    addCourse(obj, { input }) {
      const { title, views } = input;
      const id = String(courses.length + 1);
      const course = { id, title, views }; // se puede poner sin : ya que tiene el mismo nombre que la prop
      courses.push(course);
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

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema: schema,
});

server.listen().then(({ url }) => {
  console.log(`Server iniciado en ${url}`);
});
