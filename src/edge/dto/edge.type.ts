import { ObjectType, Field } from '@nestjs/graphql';
import { Edge } from '../entities/edge.entity';

@ObjectType()
export class EdgeType {
  @Field()
  id: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field()
  capacity: number;

  @Field()
  node1_alias: string;

  @Field()
  node2_alias: string;

  @Field()
  edge_peers: string;
}
