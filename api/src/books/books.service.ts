import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

export interface FindAllBooksParams {
  genreId?: string;
  search?: string;
  page?: number | string;
  limit?: number | string;
}

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        ...createBookDto,
        availableCopies: createBookDto.totalCopies,
      },
      include: { genre: true },
    });
  }

  async findAll(
    genreIdOrParams?: string | FindAllBooksParams,
    searchParam?: string,
    pageParam?: number | string,
    limitParam?: number | string,
  ) {
    let genreId: string | undefined;
    let search: string | undefined;
    let page: number;
    let limit: number;

    if (typeof genreIdOrParams === "object" && genreIdOrParams !== null) {
      genreId = genreIdOrParams.genreId;
      search = genreIdOrParams.search;
      page = Number(genreIdOrParams.page) || 1;
      limit = Number(genreIdOrParams.limit) || 10;
    } else {
      genreId = genreIdOrParams;
      search = searchParam;
      page = Number(pageParam) || 1;
      limit = Number(limitParam) || 10;
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.BookWhereInput = {};

    if (genreId) {
      where.genreId = genreId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ];
    }

    return this.prisma.book.findMany({
      where,
      skip,
      take,
      include: { genre: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true, reviews: true },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    await this.findOne(id);
    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
      include: { genre: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
