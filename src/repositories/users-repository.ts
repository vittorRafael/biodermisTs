import { Prisma, User } from "@prisma/client";

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  searchMany(query: string, page: number): Promise<User[]>;
  findByCpf(cpf: string): Promise<User | null>;
  findByToken(token: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
