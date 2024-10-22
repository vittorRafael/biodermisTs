import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { TokenExpiredError } from "../errors/token-expired-error";
import bcryptjs from "bcryptjs";

interface UpdatePasswordServicesRequest {
  token: string;
  password: string;
}

interface UpdatePasswordServicesResponse {
  userUpdated: User;
}

export class UpdatePasswordServices {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    token,
    password,
  }: UpdatePasswordServicesRequest): Promise<UpdatePasswordServicesResponse> {
    const user = await this.usersRepository.findByToken(token);
    if (!user) throw new ResourceNotFoundError();

    const now = new Date();
    const tokenTime = user.passwordResetTime
      ? new Date(user.passwordResetTime)
      : new Date();

    if (now > tokenTime) throw new TokenExpiredError();

    user.passwordResetToken = null;
    user.passwordResetTime = null;
    user.password_hash = await bcryptjs.hash(password, 6);

    const userUpdated = await this.usersRepository.save(user);

    return { userUpdated };
  }
}
