import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryConsultantsRepository } from "@/repositories/in-memory/in-memory-consultants-repository";
import { CreateAddressServices } from "./create-address";
import { InMemoryAdressesRepository } from "@/repositories/in-memory/in-memory-adresses-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { MissingInformationError } from "../errors/missing-information-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

let addressRepository: InMemoryAdressesRepository;
let consultantsRepository: InMemoryConsultantsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: CreateAddressServices;

describe("Create Address Service", () => {
  beforeEach(() => {
    addressRepository = new InMemoryAdressesRepository();
    consultantsRepository = new InMemoryConsultantsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateAddressServices(
      addressRepository,
      consultantsRepository,
      usersRepository
    );
  });

  it("should be able to create the address for users or consultants", async () => {
    await consultantsRepository.create({
      id: "consultant-01",
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: await hash("123456", 6),
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    await usersRepository.create({
      id: "user-01",
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-02",
      password_hash: await hash("123", 6),
      role: "ADMIN",
    });

    const consultant = await sut.execute({
      street: "Rua 1 de maio",
      neighborhood: "Triângulo",
      complement: "PA - Zé Lourenço",
      number: "S/N",
      zipCode: "62875000",
      city: "Chorozinho",
      state: "Ceara",
      consultantId: "consultant-01",
    });

    const user = await sut.execute({
      street: "Rua 1 de maio",
      neighborhood: "Triângulo",
      complement: "PA - Zé Lourenço",
      number: "S/N",
      zipCode: "62875000",
      city: "Chorozinho",
      state: "Ceara",
      userId: "user-01",
    });

    expect(consultant.address.id).toEqual(expect.any(String));
    expect(user.address.id).toEqual(expect.any(String));
  });

  it("should not be able to create the address without informing user and consultant", async () => {
    await expect(() => {
      return sut.execute({
        street: "Rua 1 de maio",
        neighborhood: "Triângulo",
        complement: "PA - Zé Lourenço",
        number: "S/N",
        zipCode: "62875000",
        city: "Chorozinho",
        state: "Ceara",
      });
    }).rejects.toBeInstanceOf(MissingInformationError);
  });

  it("should not be able to create the address by informing the user and the consultant at the same time", async () => {
    await consultantsRepository.create({
      id: "consultant-01",
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: await hash("123456", 6),
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    await usersRepository.create({
      id: "user-01",
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-02",
      password_hash: await hash("123", 6),
      role: "ADMIN",
    });

    await expect(() => {
      return sut.execute({
        street: "Rua 1 de maio",
        neighborhood: "Triângulo",
        complement: "PA - Zé Lourenço",
        number: "S/N",
        zipCode: "62875000",
        city: "Chorozinho",
        state: "Ceara",
        consultantId: "consultant-01",
        userId: "user-01",
      });
    }).rejects.toBeInstanceOf(MissingInformationError);
  });

  it("should not be able to create the address if the consultant or user does not exist", async () => {
    await expect(() => {
      return sut.execute({
        street: "Rua 1 de maio",
        neighborhood: "Triângulo",
        complement: "PA - Zé Lourenço",
        number: "S/N",
        zipCode: "62875000",
        city: "Chorozinho",
        state: "Ceara",
        consultantId: "consultant-01",
        userId: "user-01",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
