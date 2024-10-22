import { Prisma, Address } from "@prisma/client";

interface SearchManyResponse {
  addresses: Address[];
  totalItems: number;
}

export interface AddressesRepository {
  create(data: Prisma.AddressUncheckedCreateInput): Promise<Address>;
  searchMany(query: string, page: number): Promise<SearchManyResponse>;
  save(address: Address): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  delete(id: string): Promise<Address | null>;
}
