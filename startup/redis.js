const Redis = require("ioredis");
const session = require("express-session");
const connectRedis = require("connect-redis");
const config = require("config");
const redisPort = config.get("REDIS_PORT");
const redisPass = config.get("REDIS_PASSWORD");
const redisHost = config.get("REDIS_HOST");
const sessName = config.get("SESS_NAME");
const sessSecret = config.get("SESS_SECRET");

module.exports = async function(app) {
  const RedisStore = connectRedis(session);
  const client = new Redis({
    port: redisPort,
    host: redisHost,
    password: redisPass
  });

  const store = new RedisStore({ client });

  getSessions = async function(userId, sess) {
    let loggedIn = new Promise(async (resolve, reject) => {
      await store.all((error, results) => {
        if (error) return reject(err);

        results.map(async session => {
          if (session.ui == userId) {
            if (!sess) {
              await store.clear(session);
            }
            resolve(true);
          }
        });
        resolve(false);
      });
    });
    return loggedIn;
  };

  deleteSession = async function(userId) {
    new Promise(async (resolve, reject) => {
      await store.all((error, results) => {
        if (error) return reject(err);

        results.map(async session => {
          if (session.ui == userId) {
            await store.clear(session);
            resolve();
          }
        });
      });
    });
    return;
  };

  app.use(
    session({
      store,
      id: sessName,
      resave: false,
      saveUninitialized: false,
      secret: sessSecret,
      cookie: {
        SameSite: "none",
        httpOnly: false
      }
    })
  );
};
