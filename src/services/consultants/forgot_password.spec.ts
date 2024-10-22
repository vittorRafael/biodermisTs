import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { ForgotPasswordConsultantServices } from "./forgot_password";
import { InMemoryConsultantsRepository } from "@/repositories/in-memory/in-memory-consultants-repository";

let consultantsRepository: InMemoryConsultantsRepository;
let sut: ForgotPasswordConsultantServices;

describe("Forgot Password Use Case", () => {
  beforeEach(() => {
    consultantsRepository = new InMemoryConsultantsRepository();
    sut = new ForgotPasswordConsultantServices(consultantsRepository);
  });

  it("should be able to get token to recover password", async () => {
    await consultantsRepository.create({
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: await hash("123456", 6),
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    const { token, now } = await sut.execute({
      email: "jonhdoe@example.com",
    });

    expect(token).toEqual(expect.any(String));
    expect(now).toEqual(expect.any(Date));
  });
});
