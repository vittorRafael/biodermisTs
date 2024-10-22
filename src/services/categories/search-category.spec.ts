import { expect, describe, it, beforeEach } from "vitest";
import { SearchCategoriesServices } from "./search-category";
import { InMemoryCategoriesRepository } from "@/repositories/in-memory/in-memory-categories-repository";

let categoryRepository: InMemoryCategoriesRepository;
let sut: SearchCategoriesServices;

describe("Search category Use Case", () => {
  beforeEach(async () => {
    categoryRepository = new InMemoryCategoriesRepository();
    sut = new SearchCategoriesServices(categoryRepository);
  });

  it("should be able to search for category", async () => {
    await categoryRepository.create({
      category: "Teste",
    });

    const { categories } = await sut.execute({
      query: "teste",
      page: 1,
    });

    expect(categories).toHaveLength(1);
  });

  it("should be able to fetch paginated category search", async () => {
    for (let i = 1; i <= 22; i++) {
      await categoryRepository.create({
        category: `Teste ${i}`,
      });
    }

    const { categories } = await sut.execute({
      query: "teste",
      page: 2,
    });

    expect(categories).toHaveLength(2);
    expect(categories).toEqual([
      expect.objectContaining({ category: "Teste 21" }),
      expect.objectContaining({ category: "Teste 22" }),
    ]);
  });
  it("should be able to fetch all category ", async () => {
    for (let i = 1; i <= 22; i++) {
      await categoryRepository.create({
        category: `Teste ${i}`,
      });
    }

    const { categories } = await sut.execute({
      query: "",
      page: 1,
    });

    expect(categories).toHaveLength(20);
  });
});
