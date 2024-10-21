import { FastifyInstance } from "fastify";
import { register } from "./controllers/users/register";

export const appRoutes = async (app: FastifyInstance) => {
  /* Users Routes */
  app.post("/users", register);
};
