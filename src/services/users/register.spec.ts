import { expect, describe, it, beforeEach } from "vitest";
import { RegisterServices } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "../errors/users-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterServices;

describe("Register Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterServices(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password: "123456",
      role: "ADMIN",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password: "123456",
      role: "ADMIN",
    });
    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "jonhdoe@example.com";

    await sut.execute({
      email: email,
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password: "123456",
      role: "ADMIN",
    });

    await expect(() => {
      return sut.execute({
        email: email,
        name: "Jonh Doe",
        phone: "+55 (85) 9 99999999",
        cpf: "000.000.000-01",
        password: "123456",
        role: "ADMIN",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
