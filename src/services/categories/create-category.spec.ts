import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCategoriesRepository } from "@/repositories/in-memory/in-memory-categories-repository";
import { CreateCategoryServices } from "./create-category";

let categoryRepository: InMemoryCategoriesRepository;
let sut: CreateCategoryServices;

describe("Create Category Service", () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoriesRepository();
    sut = new CreateCategoryServices(categoryRepository);
  });

  it("should be able to create the category for products", async () => {
    const { category } = await sut.execute({
      categoryName: "Eletros",
    });

    expect(category.id).toEqual(expect.any(String));
  });
});
