import { Prisma, Address } from "@prisma/client";
import { randomUUID } from "crypto";
import { AddressesRepository } from "../addresses-repository";

export class InMemoryAdressesRepository implements AddressesRepository {
  public items: Address[] = [];

  async create(data: Prisma.AddressUncheckedCreateInput) {
    const adress = {
      id: data.id || randomUUID(),
      street: data.street,
      neighborhood: data.neighborhood,
      complement: data.complement || null,
      number: data.number,
      zipCode: data.zipCode,
      city: data.city,
      state: data.state,
      consultantId: data.consultantId || null,
      userId: data.userId || null,
      created_at: new Date(),
    };

    this.items.push(adress);

    return adress;
  }

  async searchMany(query: string, page: number) {
    const filteredItems = this.items.filter(
      (item) =>
        item.street.toLowerCase().includes(query.toLowerCase()) ||
        item.neighborhood.toLowerCase().includes(query.toLowerCase()) ||
        item.zipCode.toLowerCase().includes(query.toLowerCase()) ||
        item.city.toLowerCase().includes(query.toLowerCase()) ||
        item.state.toLowerCase().includes(query.toLowerCase()) ||
        (item.userId ?? "")
          .toString()
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        (item.consultantId ?? "")
          .toString()
          .toLowerCase()
          .includes(query.toLowerCase())
    );

    const paginatedItems = filteredItems.slice((page - 1) * 20, page * 20);

    return {
      addresses: paginatedItems,
      totalItems: this.items.length,
    };
  }

  async save(address: Address) {
    const addressIndex = this.items.findIndex((item) => item.id === address.id);
    if (addressIndex >= 0) this.items[addressIndex] = address;

    return address;
  }

  async findById(id: string) {
    const address = this.items.find((item) => item.id === id);
    if (!address) return null;

    return address;
  }

  async delete(id: string) {
    const addressIndex = this.items.findIndex((item) => item.id === id);

    // Se não encontrar o índice, retorna null
    if (addressIndex < 0) return null;

    // Remove o item e retorna o endereço deletado
    const [deletedAddress] = this.items.splice(addressIndex, 1);

    return deletedAddress;
  }
}
