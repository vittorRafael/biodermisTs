import { Prisma, Consultant, TypeKey } from "@prisma/client";
import { randomUUID } from "crypto";
import { ConsultantsRepository } from "../consultants-repository";
import { Decimal } from "@prisma/client/runtime/library";

export class InMemoryConsultantsRepository implements ConsultantsRepository {
  public items: Consultant[] = [];

  async findById(id: string) {
    const consultant = this.items.find((item) => item.id === id);
    if (!consultant) return null;

    return consultant;
  }

  async findByEmail(email: string) {
    const consultant = this.items.find((item) => item.email === email);
    if (!consultant) return null;

    return consultant;
  }

  async create(data: Prisma.ConsultantCreateInput) {
    const consultant = {
      id: data.id || randomUUID(),
      email: data.email,
      name: data.name,
      phone: data.phone,
      cpf: data.cpf,
      password_hash: data.password_hash,
      srcPhoto: null,
      srcCert: null,
      status: "ativo",
      pix: data.pix,
      typeKeyPix: data.typeKeyPix as TypeKey,
      totalBilled: new Decimal(0),
      availableValue: new Decimal(0),
      lockedValue: new Decimal(0),
      passwordResetToken: data.passwordResetToken || null,
      passwordResetTime: data.passwordResetTime || null,
      created_at: new Date(),
    };

    this.items.push(consultant);

    return consultant;
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
    const consultant = this.items.find((item) => item.cpf === cpf);
    if (!consultant) return null;

    return consultant;
  }

  async findByToken(token: string) {
    const user = this.items.find((item) => item.passwordResetToken === token);
    if (!user) return null;

    return user;
  }
}
