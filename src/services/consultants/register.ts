import { UserAlreadyExistsError } from "../errors/users-already-exists-error";
import { TypeKey, Consultant } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { ConsultantsRepository } from "@/repositories/consultants-repository";

interface RegisterServicesRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  cpf: string;
  pix: string;
  typeKeyPix: TypeKey;
}

interface RegisterServicesResponse {
  consultant: Consultant;
}

export class RegisterServices {
  constructor(private consultantsRepository: ConsultantsRepository) {}

  async execute({
    name,
    email,
    password,
    cpf,
    phone,
    pix,
    typeKeyPix,
  }: RegisterServicesRequest): Promise<RegisterServicesResponse> {
    const password_hash = await bcryptjs.hash(password, 6);

    const userWithSameEmail = await this.consultantsRepository.findByEmail(
      email
    );
    if (userWithSameEmail) throw new UserAlreadyExistsError();

    const consultant = await this.consultantsRepository.create({
      name,
      email,
      password_hash,
      cpf,
      phone,
      pix,
      typeKeyPix,
    });

    return { consultant };
  }
}
