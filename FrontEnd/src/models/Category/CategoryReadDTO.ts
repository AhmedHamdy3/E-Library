import { BookReadDTO } from "../Book/BookReadDTO";

export interface CategoryReadDTO {
    id: number;
    name: string;
    description: string;
    books: BookReadDTO[];
}
