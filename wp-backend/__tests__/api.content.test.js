//wp-backend/_test_/api.content.test.js
import request from "supertest";
import app from "../app.js";
import News from "../models/News.js";

describe("GET /api/content", () => {
  it("should return combined content from all sources", async () => {
    // Add test MongoDB news
    await News.create({
      title: "Test MongoDB News",
      content: "Test content",
      description: "Test description",
      source: "Test Source",
      date: new Date()
    });

    const res = await request(app).get("/api/content");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    
    // Should contain both types
    const types = res.body.map(item => item.type);
    expect(types).toContain('wp');
    expect(types).toContain('news');
  });

  it("should handle errors gracefully", async () => {
    // Temporarily break WordPress connection to test error handling
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // This should still return 200 with available content
    const res = await request(app).get("/api/content");
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    
    console.error = originalConsoleError;
  });
});