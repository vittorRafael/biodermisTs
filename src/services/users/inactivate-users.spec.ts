import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InactivateUsersServices } from "./inactivate-users";

let usersRepository: InMemoryUsersRepository;
let sut: InactivateUsersServices;

describe("Inactivate User Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new InactivateUsersServices(usersRepository);
  });

  it("should be able to inactivated user", async () => {
    await usersRepository.create({
      id: "user-01",
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: "123456",
    });

    await usersRepository.create({
      id: "admin-01",
      email: "jonhdoe2@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-02",
      password_hash: "123456",
      role: "ADMIN",
    });

    const { user } = await sut.execute({
      userId: "user-01",
      adminId: "admin-01",
    });

    expect(user).toEqual(expect.objectContaining({ status: "inativo" }));
    expect(user).toEqual(expect.objectContaining({ id: "user-01" }));
  });
});
