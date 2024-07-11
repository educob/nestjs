import { Module } from '@nestjs/common';
import { EdgeResolver } from './resolvers/edge.resolver';
import { EdgeService } from './services/edge.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from './entities/edge.entity';

// The @Module() decorator is used to define a module
@Module({
  // The imports array specifies which other modules this module uses
  imports: [
    // The forFeature() method of the TypeOrmModule is used to define which entities are registered in the current scope
    TypeOrmModule.forFeature([Edge])
  ],
  // The providers array specifies the classes that should be instantiated by the Nest injector and that can be shared at least across this module
  providers: [
    // The EdgeResolver is responsible for handling the GraphQL queries and mutations related to edges
    EdgeResolver,
    // The EdgeService is responsible for handling the business logic related to edges
    EdgeService
  ],
})
// The EdgeModule class is decorated with the @Module() decorator
// This means that it can be imported by other modules
export class EdgeModule {}
