import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCategoriesRepository } from "@/repositories/in-memory/in-memory-categories-repository";
import { DeleteCategoryServices } from "./delete-category";

let categoryRepository: InMemoryCategoriesRepository;
let sut: DeleteCategoryServices;

describe("Update category Service", () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoriesRepository();
    sut = new DeleteCategoryServices(categoryRepository);
  });

  it("should be able to delete category", async () => {
    await categoryRepository.create({
      id: "category-01",
      category: "Teste",
    });

    const { category } = await sut.execute({
      id: "category-01",
    });

    expect(category).toEqual(expect.objectContaining({ category: "Teste" }));
  });
});
