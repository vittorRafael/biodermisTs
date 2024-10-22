import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InactivateConsultantsServices } from "./inactivate-consultants";
import { InMemoryConsultantsRepository } from "@/repositories/in-memory/in-memory-consultants-repository";

let consultantsRepository: InMemoryConsultantsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: InactivateConsultantsServices;

describe("Inactivate Consultant Service", () => {
  beforeEach(() => {
    consultantsRepository = new InMemoryConsultantsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new InactivateConsultantsServices(
      consultantsRepository,
      usersRepository
    );
  });

  it("should be able to inactivated consultant", async () => {
    await consultantsRepository.create({
      id: "consultant-01",
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: "123456",
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
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

    const { consultant } = await sut.execute({
      consultantId: "consultant-01",
      adminId: "admin-01",
    });

    expect(consultant).toEqual(expect.objectContaining({ status: "inativo" }));
    expect(consultant).toEqual(
      expect.objectContaining({ id: "consultant-01" })
    );
  });
});
