import { CategoriesRepository } from "@/repositories/categories-repository";
import { Category } from "@prisma/client";

interface SearchCategoriesServicesRequest {
  query: string;
  page: number;
}

interface SearchCategoriesServicesResponse {
  categories: Category[];
  totalItems: number;
}

export class SearchCategoriesServices {
  constructor(private categoryRepository: CategoriesRepository) {}

  async execute({
    query,
    page,
  }: SearchCategoriesServicesRequest): Promise<SearchCategoriesServicesResponse> {
    const { categories, totalItems } = await this.categoryRepository.searchMany(
      query,
      page
    );

    return { categories, totalItems };
  }
}
