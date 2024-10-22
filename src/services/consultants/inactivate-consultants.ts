import { Consultant, User } from "@prisma/client";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { AccessDeniedError } from "../errors/access-denied-error";
import { ConsultantsRepository } from "@/repositories/consultants-repository";
import { UsersRepository } from "@/repositories/users-repository";

interface InactivateConsultantsServicesRequest {
  adminId: string;
  consultantId: string;
}

interface InactivateConsultantsServicesResponse {
  consultant: Consultant;
}

export class InactivateConsultantsServices {
  constructor(
    private consultantsRepository: ConsultantsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    adminId,
    consultantId,
  }: InactivateConsultantsServicesRequest): Promise<InactivateConsultantsServicesResponse> {
    const admin = await this.usersRepository.findById(adminId);
    if (!admin) throw new ResourceNotFoundError();
    if (admin.role !== "ADMIN") throw new AccessDeniedError();

    const consultant = await this.consultantsRepository.findById(consultantId);
    if (!consultant) throw new ResourceNotFoundError();

    // Atualiza os campos necessários
    consultant.status = "inativo";

    return { consultant };
  }
}
