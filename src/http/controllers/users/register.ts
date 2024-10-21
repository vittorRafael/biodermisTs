import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "@/services/errors/users-already-exists-error";
import { makeRegisterServices } from "@/services/factories/make-register-services";

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    cpf: z.string(),
    phone: z.string(),
    password: z.string().min(6),
    position_id: z.string().uuid(),
  });

  const { name, email, cpf, phone, password, position_id } =
    registerBodySchema.parse(request.body);

  try {
    const registerServices = makeRegisterServices();
    await registerServices.execute({
      name,
      email,
      cpf,
      phone,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError)
      return reply.status(409).send({ message: error.message });

    throw error;
  }

  return reply.status(201).send();
};
