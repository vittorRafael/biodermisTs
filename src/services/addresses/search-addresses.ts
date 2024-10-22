import { AddressesRepository } from "@/repositories/addresses-repository";
import { Address } from "@prisma/client";

interface SearchAdressesServicesRequest {
  query: string;
  page: number;
}

interface SearchAdressesServicesResponse {
  addresses: Address[];
  totalItems: number;
}

export class SearchAdressesServices {
  constructor(private addressRepository: AddressesRepository) {}

  async execute({
    query,
    page,
  }: SearchAdressesServicesRequest): Promise<SearchAdressesServicesResponse> {
    const { addresses, totalItems } = await this.addressRepository.searchMany(
      query,
      page
    );

    return { addresses, totalItems };
  }
}
