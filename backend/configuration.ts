export default () => ({
  jwt_key: process.env.JWT_SECRET || 'key',
  port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  database: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    name: process.env.POSTGRES_DB || 'kupipodariday',
    username: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD || 'student',
  },
});
