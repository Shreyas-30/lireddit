import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  // to delete all users use - await orm.em.nativeDelete(User, {});
  await orm.getMigrator().up();

  const app = express();
  // app.set("trust proxy", true);
  // app.set("Access-Control-Allow-Origin", "https://studio.apollographql.com");
  // app.set("Access-Control-Allow-Credentials", true);

  // redis@v3
  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      saveUninitialized: false, //create session only when storing data
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", //csrf
        secure: __prod__, //allows cookie to only work in https
        // sameSite: "none",
        // secure: false, // if true, studio works, postman doesn't; if false its the other way around
      },
      secret: "asdfoiuabwef82p98h3p98h",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    introspection: true,
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }: MyContext) => ({ em: orm.em, req, res, redis }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false, //{ credentials: true, origin: "https://studio.apollographql.com" },
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});
