import { AddressesRepository } from "@/repositories/addresses-repository";
import { Address } from "@prisma/client";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface DeleteAddressServicesRequest {
  id: string;
}

interface DeleteAddressServicesResponse {
  address: Address;
}

export class DeleteAddressServices {
  constructor(private addressRepository: AddressesRepository) {}

  async execute({
    id,
  }: DeleteAddressServicesRequest): Promise<DeleteAddressServicesResponse> {
    const address = await this.addressRepository.delete(id);
    if (!address) throw new ResourceNotFoundError();

    return { address };
  }
}
