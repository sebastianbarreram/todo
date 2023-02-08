import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TodoEntity {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  description: string;

  @Field(() => Boolean)
  done = false;
}
