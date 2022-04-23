import DataLoader from "dataloader";
import { In } from "typeorm";
import { User } from "../entities/User";

// pass in keys/id [1, 34, 3, 6]
// return [{id: 1, username: jim}, {}, {}, {}]
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findBy({ id: In(userIds as number[]) });
    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    return userIds.map((userId) => userIdToUser[userId]);
  });
