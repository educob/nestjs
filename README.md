# Backend Developer Exercise


## Objective
This exercise is designed to evaluate skills in building a **GraphQL API** using **NestJS**. The API should perform basic **CRUD operations** on a **Postgres database** and send events to a **RabbitMQ queue**. The same NestJS server should also listen to events from this RabbitMQ queue and handle them correctly. All code should be written and well typed using **Typescript**.


## Configuration

### Postgres Database

- database: test
- user: test
- password: test

### Graphql port

- port: 3000



## Running the app

```nest start```

## Testing the Graphql API

Browser url: http://localhost:3000/graphql

### createEdge

```mutation {
  createEdge(createEdgeInput: {
    node1_alias: "node1",
    node2_alias: "node2"
  }) {
    id
    node1_alias
    node2_alias
    capacity
  }
}

```

### getEdges

```query {
  getEdges {
    id
    created_at
    updated_at
    capacity
    node1_alias
    node2_alias
  }
}
```

### getEdge¡

```query {
  getEdge(id: "your-id-here") {
    id
    created_at
    updated_at
    capacity
    node1_alias
    node2_alias
  }
}
```