import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";

//  [{postId: 4, userId: 23}]
//  [{postId: 4, userId: 23, value: 1}]
export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const users = await Updoot.findByIds(keys as any);
      const updootIdsToUpdoot: Record<string, Updoot> = {};
      users.forEach((updoot) => {
        updootIdsToUpdoot[`${updoot.postId}|${updoot.userId}`] = updoot;
      });

      return keys.map(
        (key) => updootIdsToUpdoot[`${key.postId}|${key.userId}`]
      );
    }
  );
