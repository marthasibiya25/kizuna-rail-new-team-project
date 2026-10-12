import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import TicketClass from "../src/models/schemas/ticket-classes.js";

process.env.SESSION_SECRET = "ticket-api-test-only-secret";

let mongo;
let app;

const sampleTicketClasses = [
  {
    class: "Standard",
    name: "Standard Class",
    pricePerKm: 8,
    amenities: ["Comfortable seating"],
    description: "Standard ticket for everyday travel.",
    availableDays: ["monday", "tuesday"],
  },
  {
    class: "Premium",
    name: "Premium Class",
    pricePerKm: 15,
    amenities: ["Extra legroom"],
    description: "Premium ticket for a comfortable journey.",
    availableDays: ["tuesday", "thursday"],
  },
  {
    class: "First",
    name: "First Class",
    pricePerKm: 25,
    amenities: ["Private cabin"],
    description: "First-class ticket for luxury travel.",
    availableDays: ["saturday"],
  },
];

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({ binary: { version: "7.0.14" } });
  await mongoose.connect(mongo.getUri());

  const importedApp = await import("../app.js");
  app = importedApp.default;
});

beforeEach(async () => {
  await TicketClass.deleteMany({});
  await TicketClass.insertMany(sampleTicketClasses);
});

afterAll(async () => {
  await mongoose.disconnect();

  if (mongo) {
    await mongo.stop();
  }
});

describe("GET /api/ticket-classes", () => {
  it("returns ticket classes and pagination metadata", async () => {
    const response = await request(app)
      .get("/api/ticket-classes")
      .expect(200);

    expect(response.body.data).toHaveLength(3);
    expect(response.body.metadata).toEqual({
      total: 3,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it("returns the requested page and limit", async () => {
    const response = await request(app)
      .get("/api/ticket-classes?page=2&limit=2")
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].class).toBe("First");
    expect(response.body.metadata).toEqual({
      total: 3,
      page: 2,
      limit: 2,
      totalPages: 2,
    });
  });

  it("searches ticket classes by name", async () => {
    const response = await request(app)
      .get("/api/ticket-classes?search=premium")
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].class).toBe("Premium");
    expect(response.body.metadata.total).toBe(1);
  });

  it("filters ticket classes by available weekday", async () => {
    const response = await request(app)
      .get("/api/ticket-classes?day=tuesday")
      .expect(200);

    expect(response.body.data.map((item) => item.class)).toEqual([
      "Standard",
      "Premium",
    ]);
    expect(response.body.metadata.total).toBe(2);
  });

  it("rejects a non-positive page number", async () => {
    const response = await request(app)
      .get("/api/ticket-classes?page=0")
      .expect(400);

    expect(response.body.error).toBe("Page must be a positive integer");
  });

  it("rejects a limit greater than ten", async () => {
    const response = await request(app)
      .get("/api/ticket-classes?limit=11")
      .expect(400);

    expect(response.body.error).toBe(
      "Limit must be an integer between 1 and 10",
    );
  });

  it("rejects an empty search term", async () => {
    const response = await request(app)
      .get("/api/ticket-classes?search=%20%20")
      .expect(400);

    expect(response.body.error).toBe("Search must not be empty");
  });

  it("rejects an invalid weekday", async () => {
    const response = await request(app)
      .get("/api/ticket-classes?day=funday")
      .expect(400);

    expect(response.body.error).toBe("Invalid day");
  });
});
