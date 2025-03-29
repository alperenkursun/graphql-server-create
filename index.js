import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { events, locations, users, participants } from "./data.js";

const typeDefs = `
  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID!
    user_id: ID!
    user: User!
    location: Location!
    participants: [Participant!]!
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
  }

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }

  type Query {
    # Event
    events: [Event!]!
    event(id: ID!): Event!

    # Location
    locations: [Location!]!
    location(id: ID!): Location!

    # User
    users: [User!]!
    user(id: ID!): User!

    # Participant
    participants: [Participant!]!
    participant(id: ID!): Participant!
  }
`;

const resolvers = {
  Query: {
    // Event
    events: () => events,
    event: (_, args) => {
      const event = events.find((event) => event.id === args.id);
      if (!event) throw new Error("Event not found");
      return event;
    },

    // Location
    locations: () => locations,
    location: (_, args) => {
      const location = locations.find((location) => location.id === args.id);
      if (!location) throw new Error("Location not found");
      return location;
    },

    // User
    users: () => users,
    user: (_, args) => {
      const user = users.find((user) => user.id === args.id);
      if (!user) throw new Error("User not found");
      return user;
    },

    // Participant
    participants: () => participants,
    participant: (_, args) => {
      const participant = participants.find(
        (participant) => participant.id === args.id
      );
      if (!participant) throw new Error("Participant not found");
      return participant;
    },
  },

  User: {
    events: (parent) => events.filter((event) => event.user_id === parent.id),
  },

  Event: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
    location: (parent) =>
      locations.find((location) => location.id === parent.location_id),
    participants: (parent) =>
      participants.filter((participant) => participant.event_id === parent.id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
