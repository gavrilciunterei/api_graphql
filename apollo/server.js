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

type Query{
  getCourses(page: Int, limit: Int = 1) : [Course]
}

type Mutation{
    addCourse(input: CourseInput): Course
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
  },
  Mutation: {
    addCourse(obj, { input }) {
      const { title, views } = input;
      const id = String(courses.length + 1);
      const course = { id, title, views }; // se puede poner sin : ya que tiene el mismo nombre que la prop
      courses.push(course);
      return course;
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
