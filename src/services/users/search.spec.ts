import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { SearchUsersServices } from "./search";

let usersRepository: InMemoryUsersRepository;
let sut: SearchUsersServices;

describe("Search users Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new SearchUsersServices(usersRepository);
  });

  it("should be able to search for users", async () => {
    await usersRepository.create({
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: "123456",
      role: "ADMIN",
    });

    await usersRepository.create({
      email: "jonhsales@example.com",
      name: "Jonh Sales",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-02",
      password_hash: "123456",
    });

    const { users } = await sut.execute({
      query: "02",
      page: 1,
    });

    expect(users).toHaveLength(1);
    expect(users).toEqual([expect.objectContaining({ cpf: "000.000.000-02" })]);
  });

  it("should be able to fetch paginated user search", async () => {
    for (let i = 1; i <= 22; i++) {
      await usersRepository.create({
        email: `jonhdoe${i}@example.com`,
        name: `Jonh Doe ${i}`,
        phone: "+55 85 9 99999999",
        cpf: `000.000.000-${i < 10 ? "0" + i : i}`,
        password_hash: "123456",
        role: "ADMIN",
      });
    }

    const { users } = await sut.execute({
      query: "Doe",
      page: 2,
    });

    expect(users).toHaveLength(2);
    expect(users).toEqual([
      expect.objectContaining({ name: "Jonh Doe 21" }),
      expect.objectContaining({ name: "Jonh Doe 22" }),
    ]);
  });
  it("should be able to fetch all users", async () => {
    for (let i = 1; i <= 22; i++) {
      await usersRepository.create({
        email: `jonhdoe${i}@example.com`,
        name: `Jonh Doe ${i}`,
        phone: "+55 85 9 99999999",
        cpf: `000.000.000-${i < 10 ? "0" + i : i}`,
        password_hash: "123456",
        role: "ADMIN",
      });
    }

    const { users } = await sut.execute({
      query: "",
      page: 1,
    });

    expect(users).toHaveLength(20);
  });
});
