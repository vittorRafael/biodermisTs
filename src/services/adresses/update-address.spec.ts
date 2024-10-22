import { expect, describe, it, beforeEach } from "vitest";
import { UpdateAddressServices } from "./update-address";
import { InMemoryAdressesRepository } from "@/repositories/in-memory/in-memory-adresses-repository";

let addressRepository: InMemoryAdressesRepository;
let sut: UpdateAddressServices;

describe("Update address Service", () => {
  beforeEach(() => {
    addressRepository = new InMemoryAdressesRepository();
    sut = new UpdateAddressServices(addressRepository);
  });

  it("should be able to updated address", async () => {
    await addressRepository.create({
      id: "address-01",
      street: "Rua 1 de maio",
      neighborhood: "Triângulo",
      complement: "PA - Zé Lourenço",
      number: "S/N",
      zipCode: "62875000",
      city: "Chorozinho",
      state: "Ceara",
      consultantId: "consultant-01",
    });

    const { addressUpdated } = await sut.execute({
      id: "address-01",
      street: "Rua teste",
      neighborhood: "teste",
      complement: "PA - teste",
      number: "S/N",
      zipCode: "62875000",
      city: "Chorozinho",
      state: "Ceara",
    });

    expect(addressUpdated).toEqual(
      expect.objectContaining({ street: "Rua teste" })
    );
  });
});
