import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  InputType,
  Field,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { Post } from "../entities/Post";
import { Updoot } from "../entities/Updoot";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req, em }: MyContext
  ): Promise<Boolean> {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;
    const updoot = await Updoot.findOne({ where: { postId, userId } });
    console.log("realValue: ", realValue);
    // the user has voted on the post before
    // and they are changing their vote
    if (updoot && updoot.value !== realValue) {
      await em.transaction(async (tm) => {
        await tm.query(
          `
          update updoot
          set value = $1
          where "postId" = $2 and "userId" = $3
        `,
          [value, postId, userId]
        );

        await tm.query(
          `
          update post 
          set points  = points + $1
          where id = $2;
        `,
          [2 * realValue, postId]
        );
      });
    } else if (!updoot) {
      // has never voted before
      await em.transaction(async (tm) => {
        await tm.query(
          `
        insert into updoot ("userId", "postId", value)
        values($1, $2, $3);
        `,
          [userId, postId, value]
        );

        tm.query(
          `
        update post 
        set points  = points + $1
        where id = $2;
        `,
          [value, postId]
        );
      });
    }
    // await Updoot.insert({
    //   userId,
    //   postId,
    //   value: realValue,
    // });

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { em }: MyContext
  ): Promise<PaginatedPosts> {
    //20->21
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }
    const posts = await em.query(
      `
      select p.*, 
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email,
        'createdAt', u."createdAt",
        'updatedAt', u."updatedAt"
        ) creator
      from post p
      inner join public.user u on u.id = p."creatorId"
      ${cursor ? `where p."createdAt" < $2` : ""}
      order by "createdAt" DESC
      limit $1
    `,
      replacements
    );

    // const qb = em
    //   .createQueryBuilder(Post, "p")
    //   .orderBy('"createdAt"', "DESC")
    //   .take(realLimitPlusOne);

    // if (cursor) {
    //   qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
    // }

    // const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
    // return Post.find();
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return await em.findOneBy(Post, { id });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req, em }: MyContext
  ): Promise<Post> {
    const result = await em
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values({
        ...input,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
    // return em.create(Post, { ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { where: { id } });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await em.update(Post, { id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.delete(Post, id);
    return true;
  }
}
