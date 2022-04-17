import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import Redis from "ioredis";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: { userId: number } };
  redis: Redis;
  res: Response;
};
