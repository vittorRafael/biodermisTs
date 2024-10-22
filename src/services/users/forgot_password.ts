import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import crypto from "crypto";

interface ForgotPasswordServicesRequest {
  email: string;
}
interface ForgotPasswordServicesResponse {
  token: String;
  now: Date;
}

export class ForgotPasswordServices {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
  }: ForgotPasswordServicesRequest): Promise<ForgotPasswordServicesResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new ResourceNotFoundError();

    const token = crypto.randomBytes(20).toString("hex");
    const now = new Date();
    now.setHours(now.getHours() + 1);

    return { token, now };
  }
}
