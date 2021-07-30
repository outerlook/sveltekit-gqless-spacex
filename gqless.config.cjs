/**
 * @type {import("@gqless/cli").GQlessConfig}
 */
const config = {
  react: false,
  scalarTypes: { DateTime: 'string' },
  introspection: {
    endpoint: 'https://api.spacex.land/graphql/',
    headers: {},
  },
  destination: './src/lib/gqless/index.ts',
  subscriptions: false,
};

module.exports = config;
