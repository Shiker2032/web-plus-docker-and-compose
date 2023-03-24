export default () => ({
  jwt_key: process.env.jwt_secret || 'key',
});
