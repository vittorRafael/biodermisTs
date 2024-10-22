import { AddressesRepository } from "@/repositories/addresses-repository";
import { Address } from "@prisma/client";

interface SearchAdressesServicesRequest {
  query: string;
  page: number;
}

interface SearchAdressesServicesResponse {
  addresses: Address[];
}

export class SearchAdressesServices {
  constructor(private addressRepository: AddressesRepository) {}

  async execute({
    query,
    page,
  }: SearchAdressesServicesRequest): Promise<SearchAdressesServicesResponse> {
    const addresses = await this.addressRepository.searchMany(query, page);

    return { addresses };
  }
}
