import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

// m to n
// many to many
// user <-> posts
// user -> join table <- posts
// user -> updoot <- posts
@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.updoots)
  user: User;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.updoots)
  post: Post;
}

// ObjectType();
// Entity();
// export class Updoot extends BaseEntity {
//   @Field()
//   @Column({ type: "int" })
//   value: number;

//   @Field()
//   @PrimaryColumn()
//   userId: number;

//   @Field(() => User)
//   @ManyToOne(() => User, (user) => user.updoots)
//   user: User;

//   @Field()
//   @PrimaryColumn()
//   postId: number;

//   @Field(() => Post)
//   @ManyToOne(() => Post, (post) => post.updoots)
//   post: Post;
// }