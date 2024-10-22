import { Address } from "@prisma/client";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { AddressesRepository } from "@/repositories/addresses-repository";

interface UpdateAddressServicesRequest {
  id: string;
  street: string;
  neighborhood: string;
  complement: string;
  number: string;
  zipCode: string;
  city: string;
  state: string;
}

interface UpdateAddressServicesResponse {
  addressUpdated: Address;
}

export class UpdateAddressServices {
  constructor(private addressRepository: AddressesRepository) {}

  async execute({
    id,
    street,
    neighborhood,
    complement,
    number,
    zipCode,
    city,
    state,
  }: UpdateAddressServicesRequest): Promise<UpdateAddressServicesResponse> {
    const address = await this.addressRepository.findById(id);
    if (!address) throw new ResourceNotFoundError();

    // Atualiza os campos necessários
    address.street = street || address.street;
    address.neighborhood = neighborhood || address.neighborhood;
    address.complement = complement || address.complement;
    address.number = number || address.number;
    address.zipCode = zipCode || address.zipCode;
    address.city = city || address.city;
    address.state = state || address.state;

    const addressUpdated = await this.addressRepository.save(address);

    return { addressUpdated };
  }
}
