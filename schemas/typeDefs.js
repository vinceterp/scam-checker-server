const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type ScamInputData {
    email: String
    url: String
    phoneNumber: String
    textContent: String
  }

  type ScamCheck {
    id: ID!
    input: ScamInputData!
    result: ScamResult!
    comment: String
    tag: String
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input ScamInput {
    email: String
    url: String
    phoneNumber: String
    textContent: String
  }

  type ScamResult {
    score: Float!
    flags: [String!]!
    explanation: String
    confidence: Float
  }

  type Query {
    scamChecks: [ScamCheck!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    checkScam(input: ScamInput!, comment: String, tag: String): ScamResult!
  }
`;

module.exports = typeDefs;
