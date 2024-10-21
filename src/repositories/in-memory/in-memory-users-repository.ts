import { $Enums, Prisma, Role, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id);
    if (!user) return null;

    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);
    if (!user) return null;

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: data.id || randomUUID(),
      email: data.email,
      name: data.name,
      phone: data.phone,
      cpf: data.cpf,
      password_hash: data.password_hash,
      srcPhoto: null,
      srcCert: null,
      passwordResetToken: null,
      passwordResetTime: null,
      role: data.role as Role,
      created_at: new Date(),
    };

    this.items.push(user);

    return user;
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.email.toLowerCase().includes(query.toLowerCase()) ||
          item.cpf.includes(query) // CPF geralmente não é case-sensitive, então não precisa de 'toLowerCase'
      )
      .slice((page - 1) * 20, page * 20);
  }

  async findByCpf(cpf: string) {
    const user = this.items.find((item) => item.cpf === cpf);
    if (!user) return null;

    return user;
  }
}
