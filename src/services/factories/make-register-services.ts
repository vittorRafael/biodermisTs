import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterServices } from "../users/register";

export function makeRegisterServices() {
  const usersRepository = new PrismaUsersRepository();
  const registerServices = new RegisterServices(usersRepository);

  return registerServices;
}
