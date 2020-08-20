// CORS set up
const whitelist = [
  "http://localhost",
  "http://localhost:5000"
];

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  allowedHeaders: "accept, content-type"
};

module.exports = corsOptions;