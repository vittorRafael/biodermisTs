import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";

interface SearchUsersServicesRequest {
  query: string;
  page: number;
}

interface SearchUsersServicesResponse {
  users: User[];
  totalItems: number;
}

export class SearchUsersServices {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    query,
    page,
  }: SearchUsersServicesRequest): Promise<SearchUsersServicesResponse> {
    const { totalItems, users } = await this.usersRepository.searchMany(
      query,
      page
    );

    return { users, totalItems };
  }
}
