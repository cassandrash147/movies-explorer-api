const options = {
  origin: [

    'https://cassandrash.nomoredomains.icu', 'http://cassandrash.nomoredomains.icu',
  ],
  methods: ['GET', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = options;
