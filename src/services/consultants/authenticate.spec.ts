import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { AuthenticateConsultantServices } from "./authenticate";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { InMemoryConsultantsRepository } from "@/repositories/in-memory/in-memory-consultants-repository";

let consultantsRepository: InMemoryConsultantsRepository;
let sut: AuthenticateConsultantServices;

describe("Authenticate Consultant Use Case", () => {
  beforeEach(() => {
    consultantsRepository = new InMemoryConsultantsRepository();
    sut = new AuthenticateConsultantServices(consultantsRepository);
  });

  it("should be able to authenticate consultant", async () => {
    await consultantsRepository.create({
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: await hash("123456", 6),
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    const { consultant } = await sut.execute({
      email: "jonhdoe@example.com",
      password: "123456",
    });

    expect(consultant.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate consultant with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "jonhdoe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate consultant with wrong password", async () => {
    await consultantsRepository.create({
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: await hash("123", 6),
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    await expect(() =>
      sut.execute({
        email: "jonhdoe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
