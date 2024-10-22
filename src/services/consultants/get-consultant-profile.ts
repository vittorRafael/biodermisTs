import { UsersRepository } from "@/repositories/users-repository";
import { Consultant, User } from "@prisma/client";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { ConsultantsRepository } from "@/repositories/consultants-repository";

interface GetConsultantProfileServicesResquest {
  consultantId: string;
}
interface GetConsultantProfileServicesResponse {
  consultant: Consultant;
}

export class GetConsultantProfileServices {
  constructor(private consultantsRepository: ConsultantsRepository) {}

  async execute({
    consultantId,
  }: GetConsultantProfileServicesResquest): Promise<GetConsultantProfileServicesResponse> {
    const consultant = await this.consultantsRepository.findById(consultantId);
    if (!consultant) throw new ResourceNotFoundError();

    return { consultant };
  }
}
