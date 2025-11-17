import request from "supertest";
import app from "../app.js";

describe("WordPress API Endpoints", () => {
  it("GET /api/posts should return WordPress posts", async () => {
    const res = await request(app).get("/api/posts");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('title.rendered');
      expect(res.body[0].type).toBe('wp');
    }
  });

  it("GET /api/debug/wordpress should return debug info", async () => {
    const res = await request(app).get("/api/debug/wordpress");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalPosts');
    expect(res.body).toHaveProperty('posts');
  });
});