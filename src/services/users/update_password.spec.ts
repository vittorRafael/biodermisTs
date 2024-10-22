import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UpdatePasswordServices } from "./update_password";

let usersRepository: InMemoryUsersRepository;
let sut: UpdatePasswordServices;

describe("Update Password Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdatePasswordServices(usersRepository);
  });

  it("should be able to updated password", async () => {
    const date = new Date();
    date.setHours(date.getHours() + 1);

    await usersRepository.create({
      id: "user-01",
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: "123456",
      passwordResetToken: "test1",
      passwordResetTime: date.toString(),
      role: "ADMIN",
    });

    const { userUpdated } = await sut.execute({
      token: "test1",
      password: "new-password",
    });

    expect(userUpdated).toEqual(
      expect.objectContaining({ email: "jonhdoe@example.com" })
    );
    expect(userUpdated.password_hash).toEqual(expect.any(String));
    expect(userUpdated).toEqual(
      expect.objectContaining({ passwordResetToken: null })
    );
  });
});
