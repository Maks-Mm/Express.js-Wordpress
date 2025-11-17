import request from "supertest";
import app from "../app.js";

describe("Health Check Endpoints", () => {
  it("GET /api/health should return server status", async () => {
    const res = await request(app).get("/api/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('message', 'Server is running with extended features');
  });
});