import { z } from "zod";

export class ApiResponseError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "ApiResponseError";
  }
}

export async function requestJson<T>(
  input: URL | string,
  schema: z.ZodSchema<T>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(input, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new ApiResponseError(`Weather service request failed (HTTP ${response.status})`, response.status);
  }

  const json: unknown = await response.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiResponseError("Weather service returned malformed data.");
  }

  return parsed.data;
}

