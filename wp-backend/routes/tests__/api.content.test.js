//wb-backend/routes/tests__/api.content.test.js
import request from "supertest";
import app from "../app.js";

describe("GET /api/content", () => {
  it("returns combined content array", async () => {
    const res = await request(app).get("/api/content");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
