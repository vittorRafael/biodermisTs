import { expect, describe, it, beforeEach } from "vitest";
import { RegisterServices } from "./register";
import { compare } from "bcryptjs";
import { UserAlreadyExistsError } from "../errors/users-already-exists-error";
import { InMemoryConsultantsRepository } from "@/repositories/in-memory/in-memory-consultants-repository";

let consultantsRepository: InMemoryConsultantsRepository;
let sut: RegisterServices;

describe("Register Consultant Service", () => {
  beforeEach(() => {
    consultantsRepository = new InMemoryConsultantsRepository();
    sut = new RegisterServices(consultantsRepository);
  });

  it("should be able to register the consultant", async () => {
    const { consultant } = await sut.execute({
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password: "123456",
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    expect(consultant.id).toEqual(expect.any(String));
  });

  it("should hash consultant password upon registration", async () => {
    const { consultant } = await sut.execute({
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password: "123456",
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });
    const isPasswordCorrectlyHashed = await compare(
      "123456",
      consultant.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register consultant with same email twice", async () => {
    const email = "jonhdoe@example.com";

    await sut.execute({
      email: email,
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password: "123456",
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    await expect(() => {
      return sut.execute({
        email: email,
        name: "Jonh Doe",
        phone: "+55 85 9 99999999",
        cpf: "000.000.000-01",
        password: "123456",
        pix: "85999999999",
        typeKeyPix: "TELEFONE",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
