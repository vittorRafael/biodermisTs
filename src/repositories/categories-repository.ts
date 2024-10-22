import { Prisma, Category } from "@prisma/client";

interface SearchManyCategoriesResponse {
  categories: Category[];
  totalItems: number;
}

export interface CategoriesRepository {
  create(data: Prisma.CategoryCreateInput): Promise<Category>;
  searchMany(
    query: string,
    page: number
  ): Promise<SearchManyCategoriesResponse>;
  findById(id: string): Promise<Category | null>;
  delete(id: string): Promise<Category | null>;
}
