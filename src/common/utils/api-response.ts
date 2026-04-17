export type ApiMeta = Record<string, unknown>;

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: unknown;
  meta?: ApiMeta;
}

export class ApiResponse {
  static success<T>(
    data?: T | null,
    message = 'Success',
    meta?: ApiMeta | null,
  ): ApiSuccessResponse<T> {
    return {
      success: true,
      message,
      ...(data !== null && data !== undefined ? { data } : {}),
      ...(meta !== null && meta !== undefined ? { meta } : {}),
    };
  }

  static error(
    message = 'Something went wrong',
    errors: unknown = null,
    meta?: ApiMeta | null,
  ): ApiErrorResponse {
    return {
      success: false,
      message,
      errors,
      ...(meta !== null && meta !== undefined ? { meta } : {}),
    };
  }

  static paginated<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
    message = 'Success',
  ): ApiSuccessResponse<T[]> {
    const totalPages = Math.ceil(total / limit);

    return this.success(items, message, {
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }
}
