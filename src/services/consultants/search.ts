import { ConsultantsRepository } from "@/repositories/consultants-repository";
import { Consultant } from "@prisma/client";

interface SearchConsultantsServicesRequest {
  query: string;
  page: number;
}

interface SearchConsultantsServicesResponse {
  consultants: Consultant[];
}

export class SearchConsultantsServices {
  constructor(private consultantsRepository: ConsultantsRepository) {}

  async execute({
    query,
    page,
  }: SearchConsultantsServicesRequest): Promise<SearchConsultantsServicesResponse> {
    const consultants = await this.consultantsRepository.searchMany(
      query,
      page
    );

    return { consultants };
  }
}
