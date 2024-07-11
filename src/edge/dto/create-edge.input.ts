import { InputType, Field } from '@nestjs/graphql';
import { Min, Max } from 'class-validator';

@InputType()
export class CreateEdgeInput {
  @Field()
  node1_alias: string;

  @Field()
  node2_alias: string;

}
