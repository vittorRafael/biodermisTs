import { ConsultantsRepository } from "@/repositories/consultants-repository";
import { Consultant } from "@prisma/client";

interface SearchConsultantsServicesRequest {
  query: string;
  page: number;
}

interface SearchConsultantsServicesResponse {
  consultants: Consultant[];
  totalItems: number;
}

export class SearchConsultantsServices {
  constructor(private consultantsRepository: ConsultantsRepository) {}

  async execute({
    query,
    page,
  }: SearchConsultantsServicesRequest): Promise<SearchConsultantsServicesResponse> {
    const { consultants, totalItems } =
      await this.consultantsRepository.searchMany(query, page);

    return { consultants, totalItems };
  }
}
