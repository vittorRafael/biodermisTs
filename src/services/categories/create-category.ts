import { Category } from "@prisma/client";
import { CategoriesRepository } from "@/repositories/categories-repository";

interface CreateCategoryServicesRequest {
  categoryName: string;
}

interface CreateCategoryServicesResponse {
  category: Category;
}

export class CreateCategoryServices {
  constructor(private categoryRepository: CategoriesRepository) {}

  async execute({
    categoryName,
  }: CreateCategoryServicesRequest): Promise<CreateCategoryServicesResponse> {
    const category = await this.categoryRepository.create({
      category: categoryName,
    });

    return { category };
  }
}
