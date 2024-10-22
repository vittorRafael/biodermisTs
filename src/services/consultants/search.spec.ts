import { expect, describe, it, beforeEach } from "vitest";
import { SearchConsultantsServices } from "./search";
import { InMemoryConsultantsRepository } from "@/repositories/in-memory/in-memory-consultants-repository";

let consultantsRepository: InMemoryConsultantsRepository;
let sut: SearchConsultantsServices;

describe("Search Consultants Use Case", () => {
  beforeEach(async () => {
    consultantsRepository = new InMemoryConsultantsRepository();
    sut = new SearchConsultantsServices(consultantsRepository);
  });

  it("should be able to search for consultants", async () => {
    await consultantsRepository.create({
      email: "jonhdoe@example.com",
      name: "Jonh Doe",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-01",
      password_hash: "123456",
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    await consultantsRepository.create({
      email: "jonhsales@example.com",
      name: "Jonh Sales",
      phone: "+55 85 9 99999999",
      cpf: "000.000.000-02",
      password_hash: "123456",
      pix: "85999999999",
      typeKeyPix: "TELEFONE",
    });

    const { consultants } = await sut.execute({
      query: "02",
      page: 1,
    });

    expect(consultants).toHaveLength(1);
    expect(consultants).toEqual([
      expect.objectContaining({ cpf: "000.000.000-02" }),
    ]);
  });

  it("should be able to fetch paginated consultant search", async () => {
    for (let i = 1; i <= 22; i++) {
      await consultantsRepository.create({
        email: `jonhdoe${i}@example.com`,
        name: `Jonh Doe ${i}`,
        phone: "+55 85 9 99999999",
        cpf: `000.000.000-${i < 10 ? "0" + i : i}`,
        password_hash: "123456",
        pix: "85999999999",
        typeKeyPix: "TELEFONE",
      });
    }

    const { consultants } = await sut.execute({
      query: "Doe",
      page: 2,
    });

    expect(consultants).toHaveLength(2);
    expect(consultants).toEqual([
      expect.objectContaining({ name: "Jonh Doe 21" }),
      expect.objectContaining({ name: "Jonh Doe 22" }),
    ]);
  });
  it("should be able to fetch all consultants", async () => {
    for (let i = 1; i <= 22; i++) {
      await consultantsRepository.create({
        email: `jonhdoe${i}@example.com`,
        name: `Jonh Doe ${i}`,
        phone: "+55 85 9 99999999",
        cpf: `000.000.000-${i < 10 ? "0" + i : i}`,
        password_hash: "123456",
        pix: "85999999999",
        typeKeyPix: "TELEFONE",
      });
    }

    const { consultants } = await sut.execute({
      query: "",
      page: 1,
    });

    expect(consultants).toHaveLength(20);
  });
});
