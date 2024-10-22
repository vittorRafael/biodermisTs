import { expect, describe, it, beforeEach } from "vitest";
import { UpdatePasswordConsultantServices } from "./update_password";
import { InMemoryConsultantsRepository } from "@/repositories/in-memory/in-memory-consultants-repository";

let consultantsRepository: InMemoryConsultantsRepository;
let sut: UpdatePasswordConsultantServices;

describe("Update Password Consultant Service", () => {
  beforeEach(() => {
    consultantsRepository = new InMemoryConsultantsRepository();
    sut = new UpdatePasswordConsultantServices(consultantsRepository);
  });

  it("should be able to updated password consultant", async () => {
    const date = new Date();
    date.setHours(date.getHours() + 1);

    await consultantsRepository.create({
      id: "consultant-01",
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: "123456",
      passwordResetToken: "test1",
      passwordResetTime: date.toString(),
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    const { consultant } = await sut.execute({
      token: "test1",
      password: "new-password",
    });

    expect(consultant).toEqual(
      expect.objectContaining({ email: "jonhdoe@example.com" })
    );
    expect(consultant.password_hash).toEqual(expect.any(String));
    expect(consultant).toEqual(
      expect.objectContaining({ passwordResetToken: null })
    );
  });
});
