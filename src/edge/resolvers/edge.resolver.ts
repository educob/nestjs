// Import necessary decorators and types from NestJS and GraphQL
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EdgeService } from '../services/edge.service';
import { CreateEdgeInput } from '../dto/create-edge.input';
import { EdgeType } from '../dto/edge.type';

// Define the resolver for the Edge entity
@Resolver()
export class EdgeResolver {
  // Inject the EdgeService in the constructor
  constructor(private edgeService: EdgeService) {}

  // Define a query to get all edges
  @Query(() => [EdgeType])
  async getEdges() {
    // Use the EdgeService to get all edges
    return this.edgeService.getEdges();
  }

  // Define a query to get a specific edge by its id
  @Query(() => EdgeType)
  async getEdge(@Args('id') id: string) {
    // Use the EdgeService to get an edge by its id
    return this.edgeService.getEdge(id);
  }

  // Define a mutation to create a new edge
  @Mutation(() => EdgeType)
  async createEdge(@Args('createEdgeInput') createEdgeInput: CreateEdgeInput) {
    // Use the EdgeService to create a new edge with the provided input
    return this.edgeService.createEdge(createEdgeInput);
  }
}
