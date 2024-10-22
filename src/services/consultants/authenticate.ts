import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import bcryptjs from "bcryptjs";
import { Consultant } from "@prisma/client";
import { ConsultantsRepository } from "@/repositories/consultants-repository";

interface AuthenticateConsultantServicesRequest {
  email: string;
  password: string;
}
interface AuthenticateConsultantServicesResponse {
  consultant: Consultant;
}

export class AuthenticateConsultantServices {
  constructor(private consultantsRepository: ConsultantsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateConsultantServicesRequest): Promise<AuthenticateConsultantServicesResponse> {
    const consultant = await this.consultantsRepository.findByEmail(email);
    if (!consultant) throw new InvalidCredentialsError();

    const doesPasswordMatches = await bcryptjs.compare(
      password,
      consultant.password_hash
    );
    if (!doesPasswordMatches) throw new InvalidCredentialsError();

    return { consultant };
  }
}
