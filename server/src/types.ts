import { Request, Response } from "express";
import Redis from "ioredis";
import { EntityManager } from "typeorm";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { createUserLoader } from "./utils/createUserLoader";

export type MyContext = {
  req: Request & { session: { userId: number } };
  redis: Redis;
  res: Response;
  em: EntityManager;
  userLoader: ReturnType<typeof createUserLoader>;
  updootLoader: ReturnType<typeof createUpdootLoader>;
};
