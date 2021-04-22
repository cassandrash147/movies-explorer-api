module.exports = {
  server: {
    port: 3000,
  },
  db: {
    local: 'mongodb://localhost:27017/bitfilmsdb',
  },
  jwt: {
    secretKey: 'devSecret',
    expiresIn: 3600000 * 24 * 7,
  },
  pass: {
    salt: 10,
  },
};
