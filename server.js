const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

const app = express();

let courses = require('./courses');

const schema = buildSchema(`
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
      getCourses : [Course]
      getCourse(id: ID!): Course
    }
    type Mutation{
      addCourse(input: CourseInput): Course
      updateCourse(id: ID!, input: CourseInput): Course
      deleteCourse(id: ID!):Alert
    }
`);

const root = {
  getCourses() {
    return courses;
  },
  getCourse({ id }) {
    console.log(id);
    return courses.find((course) => id == course.id);
  },
  addCourse({ input }) {
    const { title, views } = input;
    const id = String(courses.length + 1);
    const course = { id, title, views }; // se puede poner sin : ya que tiene el mismo nombre que la prop
    courses.push(course);
    return course;
  },
  updateCourse({ id, input }) {
    // buscamos el curso que queremos modificar
    const courseIndex = courses.findIndex((course) => id === course.id);
    const course = courses[courseIndex];
    // reemplaza los valores inciales del objeto que está actualizando
    const newCourse = Object.assign(course, { input });
    // guardamos en el arrya el nuevo para sustituir el viejo
    course[courseIndex] = newCourse;

    return newCourse;
  },
  deleteCourse({ id }) {
    courses = courses.filter((course) => course.id != id);
    return {
      message: `El curso con id ${id} fue eliminado`,
    };
  },
};

app.get('/', function (req, res) {
  res.send('Bienvenido');
});

//middleware (el servidor)
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(8080, function () {
  console.log('Server on en: http://localhost:8080');
});
