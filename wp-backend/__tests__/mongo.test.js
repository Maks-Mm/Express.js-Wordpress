import request from "supertest";
import app from "../app.js";
import News from "../models/News.js";

describe("MongoDB News API", () => {
  beforeEach(async () => {
    await News.deleteMany({});
  });

  it("POST /api/mongo/news/insert should insert news items", async () => {
    const testItems = [
      {
        title: "Test News 1",
        content: "Test content 1",
        description: "Test description 1",
        source: "Test Source",
        link: "http://test1.com"
      },
      {
        title: "Test News 2", 
        content: "Test content 2",
        description: "Test description 2",
        source: "Test Source",
        link: "http://test2.com"
      }
    ];

    const res = await request(app)
      .post("/api/mongo/news/insert")
      .send({ items: testItems });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('count', 2);
    expect(res.body.inserted).toHaveLength(2);
  });

  it("POST /api/mongo/news/insert should prevent duplicates", async () => {
    const testItem = {
      title: "Duplicate Test",
      content: "Test content",
      description: "Test description", 
      source: "Test Source",
      link: "http://unique-link.com"
    };

    // Insert first time
    await request(app)
      .post("/api/mongo/news/insert")
      .send({ items: [testItem] });

    // Try to insert duplicate
    const res = await request(app)
      .post("/api/mongo/news/insert")
      .send({ items: [testItem] });

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(0); // No new items inserted
    expect(res.body.inserted).toHaveLength(0);
  });

  it("GET /api/mongo/news should return MongoDB news", async () => {
    // Add test data
    await News.create({
      title: "Test News",
      content: "Test content",
      description: "Test description",
      source: "Test Source",
      date: new Date()
    });

    const res = await request(app).get("/api/mongo/news");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('source');
    }
  });
});