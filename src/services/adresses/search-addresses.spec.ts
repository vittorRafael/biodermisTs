import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryAdressesRepository } from "@/repositories/in-memory/in-memory-adresses-repository";
import { SearchAdressesServices } from "./search-addresses";

let addressRepository: InMemoryAdressesRepository;
let sut: SearchAdressesServices;

describe("Search Addresses Use Case", () => {
  beforeEach(async () => {
    addressRepository = new InMemoryAdressesRepository();
    sut = new SearchAdressesServices(addressRepository);
  });

  it("should be able to search for addresses", async () => {
    await addressRepository.create({
      street: "Rua 1 de maio",
      neighborhood: "Triângulo",
      complement: "PA - Zé Lourenço",
      number: "S/N",
      zipCode: "62875000",
      city: "Chorozinho",
      state: "Ceara",
      consultantId: "consultant-01",
    });

    const { addresses } = await sut.execute({
      query: "de maio",
      page: 1,
    });

    expect(addresses).toHaveLength(1);
    expect(addresses).toEqual([expect.objectContaining({ state: "Ceara" })]);
  });

  it("should be able to fetch paginated addresses search", async () => {
    for (let i = 1; i <= 22; i++) {
      await addressRepository.create({
        street: `Rua ${i} de maio`,
        neighborhood: "Triângulo",
        complement: "PA - Zé Lourenço",
        number: `${i}`,
        zipCode: "62875000",
        city: "Chorozinho",
        state: "Ceara",
        consultantId: `consultant-${i}`,
      });
    }

    const { addresses } = await sut.execute({
      query: "de maio",
      page: 2,
    });

    expect(addresses).toHaveLength(2);
    expect(addresses).toEqual([
      expect.objectContaining({ consultantId: "consultant-21" }),
      expect.objectContaining({ consultantId: "consultant-22" }),
    ]);
  });
  it("should be able to fetch all addresses ", async () => {
    for (let i = 1; i <= 22; i++) {
      await addressRepository.create({
        street: `Rua ${i} de maio`,
        neighborhood: "Triângulo",
        complement: "PA - Zé Lourenço",
        number: `${i}`,
        zipCode: "62875000",
        city: "Chorozinho",
        state: "Ceara",
        consultantId: `consultant-${i}`,
      });
    }

    const { addresses } = await sut.execute({
      query: "",
      page: 1,
    });

    expect(addresses).toHaveLength(20);
  });
});
