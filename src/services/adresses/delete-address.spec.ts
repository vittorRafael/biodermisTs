import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryAdressesRepository } from "@/repositories/in-memory/in-memory-adresses-repository";
import { DeleteAddressServices } from "./delete-address";

let addressRepository: InMemoryAdressesRepository;
let sut: DeleteAddressServices;

describe("Update address Service", () => {
  beforeEach(() => {
    addressRepository = new InMemoryAdressesRepository();
    sut = new DeleteAddressServices(addressRepository);
  });

  it("should be able to delete address", async () => {
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

    await addressRepository.create({
      id: "address-02",
      street: "Rua 1 de maio",
      neighborhood: "Triângulo",
      complement: "PA - Zé Lourenço",
      number: "S/N",
      zipCode: "62875000",
      city: "Chorozinho",
      state: "Ceara",
      consultantId: "consultant-01",
    });

    const { address } = await sut.execute({
      id: "address-01",
    });

    expect(address).toEqual(
      expect.objectContaining({ street: "Rua 1 de maio" })
    );
  });
});
