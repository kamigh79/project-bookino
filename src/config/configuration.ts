require('dotenv').config();
export default () => ({
  mongo: {
    uri: process.env.MONGO_DB_URI || '',
    db: process.env.MONGO_DB_DATABASE || 'bookgeram',
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY || 'secretKey',
  },
  pagination: {
    perPage: 10,
  },
});
