import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";

interface SearchUsersServicesRequest {
  query: string;
  page: number;
}

interface SearchUsersServicesResponse {
  users: User[];
}

export class SearchUsersServices {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    query,
    page,
  }: SearchUsersServicesRequest): Promise<SearchUsersServicesResponse> {
    const users = await this.usersRepository.searchMany(query, page);

    return { users };
  }
}
