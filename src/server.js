"use strict";
// must be first
const datadog = require("dd-trace");
datadog.init({});

const Fastify = require("fastify");
const mercurius = require("mercurius");

const app = Fastify();

const schema = `
  type Query {
    add(x: Int, y: Int): Int
  }
`;

const resolvers = {
  Query: {
    add: async (_, { x, y }) => x + y,
  },
};

app.register(mercurius, {
  schema,
  resolvers,
  jit: 1, // After `n` requests (whatever you have set here), we start losing the spans after the JIT occurs
});

app.get("/", async function (req, reply) {
  const query = "{ add(x: 2, y: 2) }";
  return reply.graphql(query);
});

app.listen({ port: 3000 });
