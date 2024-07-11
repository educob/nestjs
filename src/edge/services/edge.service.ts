import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from '../entities/edge.entity';
import { MessagePattern, Client, Transport, ClientProxy } from '@nestjs/microservices';
import { CreateEdgeInput } from '../dto/create-edge.input';
import { connect, Connection, Channel } from 'amqplib';

// The EdgeService class is decorated with the @Injectable() decorator
// This means that it can be injected as a dependency in other components
@Injectable()
export class EdgeService implements OnModuleInit {
  private channel: Channel;

  // The constructor injects the Edge repository
  constructor(
    @InjectRepository(Edge)
    private edgeRepository: Repository<Edge>,
  ) { }

  // The onModuleInit() method is a lifecycle hook that is called when the module is initialized
  async onModuleInit() {
    // Connect to RabbitMQ server
    const connection: Connection = await connect('amqp://localhost:5672');
    // Create a channel
    this.channel = await connection.createChannel();
    // Assert a queue into existence
    await this.channel.assertQueue('edge_queue', { durable: false });
    // Assert an exchange into existence
    await this.channel.assertExchange('new_edge_queue', 'direct', { durable: false });
    // Bind the queue to the exchange
    await this.channel.bindQueue('edge_queue', 'new_edge_queue', '');

    // Connect to the RabbitMQ server
    this.client.connect()
      .then(() => console.log('Connected to RabbitMQ'))
      .catch(err => console.error('Failed to connect to RabbitMQ', err));
  }

  // The @Client() decorator is used to inject a microservice client proxy
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'edge_queue',
      queueOptions: { durable: false },
    },
  })
  client: ClientProxy;

  // Method to get all edges
  async getEdges(): Promise<Edge[]> {
    return this.edgeRepository.find();
  }

  // Method to get a specific edge by id
  async getEdge(id: string): Promise<Edge> {
    return this.edgeRepository.findOne(id);
  }

  // Method to create a new edge
  async createEdge(createEdgeInput: CreateEdgeInput): Promise<Edge> {
    const newEdge = new Edge();
  
    // Get the current time
    const currentTime = new Date();
  
    // Set the created_at and updated_at fields
    newEdge.created_at = currentTime;
    newEdge.updated_at = currentTime;
  
    // Set the capacity field with a random number between 10,000 and 1,000,000
    newEdge.capacity = Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;
  
    // Set the node aliases
    newEdge.node1_alias = createEdgeInput.node1_alias;
    newEdge.node2_alias = createEdgeInput.node2_alias;
  
    // Save the new edge to the database
    const savedEdge = await this.edgeRepository.save(newEdge);

    // Emit an event after creating a new edge
    this.client.emit('new_edge_queue', savedEdge).toPromise()
    .then(() => console.log('Event emitted successfully'))
    .catch(err => console.error('Failed to emit event', err));

    return savedEdge;
  }

  // Method to handle new edge events
  @MessagePattern('new_edge_queue')
  async handleNewEdge(newEdge: any) {

    // Find the edge to update
    let edgeToUpdate = await this.edgeRepository.findOne(newEdge.id);

    // If the edge exists, update it
    if (!!edgeToUpdate) {
      edgeToUpdate.node1_alias = newEdge.node1_alias;
      edgeToUpdate.node2_alias = newEdge.node2_alias;
  
      await this.edgeRepository.save(edgeToUpdate);
    } else {
      console.log(`Edge with id ${newEdge.id} not found.`);
    }
    
    const output = `New channel between ${newEdge.node1_alias} and ${newEdge.de2_alias} with a capacity of ${newEdge.capacity} has been created.`
    console.log(output);
  }
  
}
