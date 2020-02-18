const Redis = require("ioredis");
const session = require("express-session");
const connectRedis = require("connect-redis");
const config = require("config");
const redisPort = config.get("REDIS_PORT");
const redisPass = config.get("REDIS_PASSWORD");
const redisHost = config.get("REDIS_HOST");
const sessName = config.get("SESS_NAME");
const sessSecret = config.get("SESS_SECRET");
// const sessLifetime = config.get("SESS_LIFETIME");
const nodeEnv = config.get("NODE_ENV");

module.exports = async function(app) {
  const RedisStore = connectRedis(session);
  const client = new Redis({
    port: redisPort,
    host: redisHost,
    password: redisPass
  });

  const IN_PROD = nodeEnv === "production";
  const store = new RedisStore({ client });

  getSessions = async function(userId) {
    let loggedIn = new Promise(async (resolve, reject) => {
      await store.all((error, results) => {
        if (error) return reject(err);

        results.map(session => {
          if (session.ui == userId) resolve(true);
        });
        resolve(false);
      });
    });
    return loggedIn;
  };

  app.use(
    session({
      store,
      id: sessName,
      resave: false,
      // rolling:true,
      saveUninitialized: false,
      secret: sessSecret,
      cookie: {
        sameSite: secure, 
        secure: false, //IN_PROD
        httpOnly: true
      }
    })
  );
};
