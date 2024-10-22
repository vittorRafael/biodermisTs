import { Prisma, Category } from "@prisma/client";
import { randomUUID } from "crypto";
import { CategoriesRepository } from "../categories-repository";

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = [];

  async create(data: Prisma.CategoryCreateInput) {
    const category = {
      id: data.id || randomUUID(),
      category: data.category,
    };

    this.items.push(category);

    return category;
  }

  async searchMany(query: string, page: number) {
    const filteredItems = this.items.filter((item) =>
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    const paginatedItems = filteredItems.slice((page - 1) * 20, page * 20);

    return {
      categories: paginatedItems,
      totalItems: this.items.length,
    };
  }

  async findById(id: string) {
    const category = this.items.find((item) => item.id === id);
    if (!category) return null;

    return category;
  }

  async delete(id: string) {
    const categoryIndex = this.items.findIndex((item) => item.id === id);

    // Se não encontrar o índice, retorna null
    if (categoryIndex < 0) return null;

    // Remove o item e retorna o endereço deletado
    const [deletedCategory] = this.items.splice(categoryIndex, 1);

    return deletedCategory;
  }
}
