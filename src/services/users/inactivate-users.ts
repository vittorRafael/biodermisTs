import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { AccessDeniedError } from "../errors/access-denied-error";

interface InactivateUsersServicesRequest {
  adminId: string;
  userId: string;
}

interface InactivateUsersServicesResponse {
  user: User;
}

export class InactivateUsersServices {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    adminId,
    userId,
  }: InactivateUsersServicesRequest): Promise<InactivateUsersServicesResponse> {
    const admin = await this.usersRepository.findById(adminId);
    if (!admin) throw new ResourceNotFoundError();
    if (admin.role !== "ADMIN") throw new AccessDeniedError();

    const user = await this.usersRepository.findById(userId);
    if (!user) throw new ResourceNotFoundError();

    // Atualiza os campos necessários
    user.status = "inativo";

    return { user };
  }
}
