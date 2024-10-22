import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetConsultantProfileServices } from "./get-consultant-profile";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { InMemoryConsultantsRepository } from "@/repositories/in-memory/in-memory-consultants-repository";

let consultantsRepository: InMemoryConsultantsRepository;
let sut: GetConsultantProfileServices;

describe("Get Consultant Profile Use Case", () => {
  beforeEach(() => {
    consultantsRepository = new InMemoryConsultantsRepository();
    sut = new GetConsultantProfileServices(consultantsRepository);
  });

  it("should be able to get consultant profile", async () => {
    const createdConsultant = await consultantsRepository.create({
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: await hash("123456", 6),
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    const { consultant } = await sut.execute({
      consultantId: createdConsultant.id,
    });

    expect(consultant.name).toEqual("Jonh Doe");
  });

  it("should not be able to get consultant profile with wrong id", async () => {
    await expect(() =>
      sut.execute({
        consultantId: "non-existing-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
