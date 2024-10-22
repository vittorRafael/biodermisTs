import { Category } from "@prisma/client";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { CategoriesRepository } from "@/repositories/categories-repository";

interface DeleteCategoryServicesRequest {
  id: string;
}

interface DeleteCategoryServicesResponse {
  category: Category;
}

export class DeleteCategoryServices {
  constructor(private categoryRepository: CategoriesRepository) {}

  async execute({
    id,
  }: DeleteCategoryServicesRequest): Promise<DeleteCategoryServicesResponse> {
    const category = await this.categoryRepository.delete(id);
    if (!category) throw new ResourceNotFoundError();

    return { category };
  }
}
