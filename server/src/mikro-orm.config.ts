import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to folder with migration files
    glob: "!(*.d).{js,ts}", // how to match migration files (all .js and .ts files, but not .d.ts)
    // path: path.join(__dirname, "./migrations"),
    // pathTs: path.join("./src/migrations"),
  },
  entities: [Post, User],
  dbName: "lireddit",
  user: "postgres",
  type: "postgresql",
  debug: !__prod__,
  allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];
