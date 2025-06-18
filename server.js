require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./utils/db');
const typeDefs = require('./schemas/typeDefs');
const authResolvers = require('./resolvers/auth');
const scamCheckResolvers = require('./resolvers/scamCheck');
const authMiddleware = require('./auth/authMiddleware');

const resolvers = {
  Query: {
    ...scamCheckResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...scamCheckResolvers.Mutation,
  },
};

async function startServer() {
  await connectDB();
  const app = express();
  app.use(authMiddleware);
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: req.user }),
  });
  await server.start();
  server.applyMiddleware({ app });
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
