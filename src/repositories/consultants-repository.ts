import { Prisma, Consultant } from "@prisma/client";

export interface ConsultantsRepository {
  create(data: Prisma.ConsultantCreateInput): Promise<Consultant>;
  findByEmail(email: string): Promise<Consultant | null>;
  findById(id: string): Promise<Consultant | null>;
  searchMany(query: string, page: number): Promise<Consultant[]>;
  findByCpf(cpf: string): Promise<Consultant | null>;
  findByToken(token: string): Promise<Consultant | null>;
}
