const options = {
  origin: [

    'https://cassandrash.nomoredomains.icu', 'http://cassandrash.nomoredomains.icu', 'http://localhost:5000',
  ],
  methods: ['GET', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = options;
