const ScamCheck = require('../models/ScamCheck');
const scamCheckEngine = require('../utils/scamCheckEngine');

const scamCheckResolvers = {
  Query: {
    scamChecks: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return ScamCheck.find({ user: user.id });
    },
  },
  Mutation: {
    checkScam: async (_, { input, comment, tag }, { user }) => {
      const result = await scamCheckEngine(input);
      if (user) {
        await ScamCheck.create({ user: user.id, input, result, comment, tag });
      }
      return result;
    },
  },
};

module.exports = scamCheckResolvers;
