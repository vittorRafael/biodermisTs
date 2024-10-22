import { expect, describe, it, beforeEach } from "vitest";
import { UserAlreadyExistsError } from "../errors/users-already-exists-error";
import { UpdateConsultantServices } from "./update";
import { InMemoryConsultantsRepository } from "@/repositories/in-memory/in-memory-consultants-repository";

let consultantsRepository: InMemoryConsultantsRepository;
let sut: UpdateConsultantServices;

describe("Update consultant Service", () => {
  beforeEach(() => {
    consultantsRepository = new InMemoryConsultantsRepository();
    sut = new UpdateConsultantServices(consultantsRepository);
  });

  it("should be able to updated consultant", async () => {
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

    const { consultantUpdated } = await sut.execute({
      id: "consultant-01",
      email: "jonhdoe444@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
    });

    expect(consultantUpdated).toEqual(
      expect.objectContaining({ email: "jonhdoe444@example.com" })
    );
  });

  it("should not be able to updated consultant with same email twice", async () => {
    const email = "jonhdoe@example.com";

    await consultantsRepository.create({
      email: email,
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: "123456",
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    await consultantsRepository.create({
      id: "consultant-01",
      email: "teste@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-02",
      password_hash: "123456",
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    await expect(() => {
      return sut.execute({
        id: "consultant-01",
        email: email,
        name: "Jonh Doe",
        phone: "+55 (85) 9 99999999",
        cpf: "000.000.000-01",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
