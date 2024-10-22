import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import crypto from "crypto";
import { ConsultantsRepository } from "@/repositories/consultants-repository";

interface ForgotPasswordConsultantServicesRequest {
  email: string;
}
interface ForgotPasswordConsultantServicesResponse {
  token: String;
  now: Date;
}

export class ForgotPasswordConsultantServices {
  constructor(private consultantsRepository: ConsultantsRepository) {}

  async execute({
    email,
  }: ForgotPasswordConsultantServicesRequest): Promise<ForgotPasswordConsultantServicesResponse> {
    const consultant = await this.consultantsRepository.findByEmail(email);
    if (!consultant) throw new ResourceNotFoundError();

    const token = crypto.randomBytes(20).toString("hex");
    const now = new Date();
    now.setHours(now.getHours() + 1);

    return { token, now };
  }
}
