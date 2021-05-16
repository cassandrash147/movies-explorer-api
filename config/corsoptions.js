const options = {
  origin: [

    'https://cassandrash.nomoredomains.club', 'http://cassandrash.nomoredomains.club', 'http://localhost:5000', 'http://localhost:3000',
  ],
  methods: ['GET', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = options;
