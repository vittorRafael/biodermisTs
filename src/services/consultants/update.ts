import { Consultant } from "@prisma/client";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UserAlreadyExistsError } from "../errors/users-already-exists-error";
import { ConsultantsRepository } from "@/repositories/consultants-repository";

interface UpdateConsultantServicesRequest {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
}

interface UpdateConsultantServicesResponse {
  consultantUpdated: Consultant;
}

export class UpdateConsultantServices {
  constructor(private consultantsRepository: ConsultantsRepository) {}

  async execute({
    id,
    name,
    email,
    cpf,
    phone,
  }: UpdateConsultantServicesRequest): Promise<UpdateConsultantServicesResponse> {
    const consultant = await this.consultantsRepository.findById(id);

    if (!consultant) throw new ResourceNotFoundError();

    const existEmail = await this.consultantsRepository.findByEmail(
      email || ""
    );
    if (email != consultant.email && existEmail)
      throw new UserAlreadyExistsError();

    const existCpf = await this.consultantsRepository.findByCpf(cpf || "");
    if (cpf != consultant.cpf && existCpf) throw new UserAlreadyExistsError();

    // Atualiza os campos necessários
    consultant.name = name || consultant.name;
    consultant.email = email || consultant.email;
    consultant.phone = phone || consultant.phone;
    consultant.cpf = cpf || consultant.cpf;

    const consultantUpdated = await this.consultantsRepository.save(consultant);

    return { consultantUpdated };
  }
}
