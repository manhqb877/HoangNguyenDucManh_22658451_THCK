export type Movie = {
  id?: number;
  title: string;
  year: number ;
  watched: number;
  rating?: number | null;
  created_at?: number;
  isDeleted?: boolean; // thêm theo style file mẫu
};