import { Consultant } from "@prisma/client";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { TokenExpiredError } from "../errors/token-expired-error";
import bcryptjs from "bcryptjs";
import { ConsultantsRepository } from "@/repositories/consultants-repository";

interface UpdatePasswordConsultantServicesRequest {
  token: string;
  password: string;
}

interface UpdatePasswordConsultantServicesResponse {
  consultantUpdated: Consultant;
}

export class UpdatePasswordConsultantServices {
  constructor(private consultantsRepository: ConsultantsRepository) {}

  async execute({
    token,
    password,
  }: UpdatePasswordConsultantServicesRequest): Promise<UpdatePasswordConsultantServicesResponse> {
    const consultant = await this.consultantsRepository.findByToken(token);
    if (!consultant) throw new ResourceNotFoundError();

    const now = new Date();
    const tokenTime = consultant.passwordResetTime
      ? new Date(consultant.passwordResetTime)
      : new Date();

    if (now > tokenTime) throw new TokenExpiredError();

    consultant.passwordResetToken = null;
    consultant.passwordResetTime = null;
    consultant.password_hash =
      (await bcryptjs.hash(password, 6)) || consultant.password_hash;

    const consultantUpdated = await this.consultantsRepository.save(consultant);

    return { consultantUpdated };
  }
}
