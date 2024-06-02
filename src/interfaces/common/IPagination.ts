export type RequestWithPagination = {
  page?: number;
  limit?: number;
  search?: string | null;
};

export type Pagination = {
  page: number;
  limit: number;
};

export type ResponseWithPagination = {
  page?: number;
  limit?: number;
  total?: number;
};
