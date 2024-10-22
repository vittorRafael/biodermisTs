import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { ForgotPasswordServices } from "./forgot_password";

let usersRepository: InMemoryUsersRepository;
let sut: ForgotPasswordServices;

describe("Forgot Password Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ForgotPasswordServices(usersRepository);
  });

  it("should be able to get token to recover password", async () => {
    await usersRepository.create({
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: await hash("123456", 6),
      role: "ADMIN",
    });

    const { token, now } = await sut.execute({
      email: "jonhdoe@example.com",
    });

    expect(token).toEqual(expect.any(String));
    expect(now).toEqual(expect.any(Date));
  });
});
