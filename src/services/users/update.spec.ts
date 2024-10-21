import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "../errors/users-already-exists-error";
import { UpdateUserService } from "./update";

let usersRepository: InMemoryUsersRepository;
let sut: UpdateUserService;

describe("Update User Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdateUserService(usersRepository);
  });

  it("should be able to updated", async () => {
    await usersRepository.create({
      id: "user-01",
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: "123456",
      role: "ADMIN",
    });

    const { user } = await sut.execute({
      id: "user-01",
      email: "jonhdoe444@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
    });

    expect(user).toEqual(
      expect.objectContaining({ email: "jonhdoe444@example.com" })
    );
  });

  it("should not be able to updated with same email twice", async () => {
    const email = "jonhdoe@example.com";

    await usersRepository.create({
      email: email,
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: "123456",
      role: "ADMIN",
    });

    await usersRepository.create({
      id: "user-01",
      email: "teste@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-02",
      password_hash: "123456",
      role: "ADMIN",
    });

    await expect(() => {
      return sut.execute({
        id: "user-01",
        email: email,
        name: "Jonh Doe",
        phone: "+55 (85) 9 99999999",
        cpf: "000.000.000-01",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
