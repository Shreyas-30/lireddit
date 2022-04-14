import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
// import path from "path";

export default {
  migrations: {
    // path to the folder with migrations
    path: "./src/migrations", // path to folder with migration files
    glob: "!(*.d).{js,ts}",
    // path: path.join(__dirname, "./migrations"),
    // pathTs: path.join("./src/migrations"),
  },
  entities: [Post],
  dbName: "lireddit",
  user: "postgres",
  type: "postgresql",
  debug: !__prod__,
  allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];
