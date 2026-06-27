// Base URL of the backend agent microservice (Scalekit-connected loop).
// Override with the BACKEND_URL env var on Render; defaults to the deployed backend.
export const BACKEND_URL =
  process.env.BACKEND_URL || "https://autonomous-growth-engine-backend.onrender.com";

// Single-tenant demo identifier — shared by the run + connector calls so the
// agent uses the accounts the user connected. (Multi-tenant later.)
export const IDENTIFIER = process.env.AGE_IDENTIFIER || "demo";
