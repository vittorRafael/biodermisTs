import { Address } from "@prisma/client";
import { AddressesRepository } from "@/repositories/addresses-repository";
import { ConsultantsRepository } from "@/repositories/consultants-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { MissingInformationError } from "../errors/missing-information-error";

interface CreateAddressServicesRequest {
  street: string;
  neighborhood: string;
  complement: string;
  number: string;
  zipCode: string;
  city: string;
  state: string;
  consultantId?: string;
  userId?: string;
}

interface CreateAddressServicesResponse {
  address: Address;
}

export class CreateAddressServices {
  constructor(
    private addressRepository: AddressesRepository,
    private consultantsRepository: ConsultantsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    street,
    neighborhood,
    complement,
    number,
    zipCode,
    city,
    state,
    consultantId,
    userId,
  }: CreateAddressServicesRequest): Promise<CreateAddressServicesResponse> {
    let consultant;
    let user;
    if (consultantId) {
      consultant = await this.consultantsRepository.findById(consultantId);
      if (!consultant) throw new ResourceNotFoundError();
    }

    if (userId) {
      user = await this.usersRepository.findById(userId);
      if (!user) throw new ResourceNotFoundError();
    }

    if (!userId && !consultantId) {
      throw new MissingInformationError(
        "userId / ConsultantId, need one of these two pieces of information"
      );
    } else if (userId && consultantId) {
      throw new MissingInformationError(
        "userId / ConsultantId, Please provide only one of the two pieces of information, userId or ConsultanId"
      );
    }

    const address = await this.addressRepository.create({
      street,
      neighborhood,
      complement,
      number,
      zipCode,
      city,
      state,
      consultantId: consultantId ?? null,
      userId: userId ?? null,
    });

    return { address };
  }
}
