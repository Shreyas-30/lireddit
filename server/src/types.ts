import { Request, Response } from "express";
import Redis from "ioredis";
import { EntityManager } from "typeorm";

export type MyContext = {
  req: Request & { session: { userId: number } };
  redis: Redis;
  res: Response;
  em: EntityManager;
};
