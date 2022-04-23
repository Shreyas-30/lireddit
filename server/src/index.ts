import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { DataSource } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { Updoot } from "./entities/Updoot";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { createUserLoader } from "./utils/createUserLoader";

const main = async () => {
  const appDataSource = new DataSource({
    type: "postgres",
    database: "lireddit2",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot],
  });
  await appDataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  await appDataSource.runMigrations();
  const em = appDataSource.manager;
  // em.delete(Post, {});
  const app = express();
  app.set("trust proxy", true);
  app.set("Access-Control-Allow-Origin", "https://studio.apollographql.com");
  app.set("Access-Control-Allow-Credentials", true);

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
        // secure: true, // if true, studio works, postman doesn't; if false its the other way around
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
    context: ({ req, res }: MyContext) => ({
      req,
      res,
      redis,
      em,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
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
