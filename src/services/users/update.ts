import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UserAlreadyExistsError } from "../errors/users-already-exists-error";

interface UpdateServicesRequest {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
}

interface UpdateServicesResponse {
  userUpdated: User;
}

export class UpdateUserServices {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    name,
    email,
    cpf,
    phone,
  }: UpdateServicesRequest): Promise<UpdateServicesResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) throw new ResourceNotFoundError();

    const existEmail = await this.usersRepository.findByEmail(email || "");
    if (email != user.email && existEmail) throw new UserAlreadyExistsError();

    const existCpf = await this.usersRepository.findByCpf(cpf || "");
    if (cpf != user.cpf && existCpf) throw new UserAlreadyExistsError();

    // Atualiza os campos necessários
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.cpf = cpf || user.cpf;

    const userUpdated = await this.usersRepository.save(user);

    return { userUpdated };
  }
}
