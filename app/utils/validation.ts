import type z from "zod";

type TFieldErrors = Record<string, string>;

export function formValidation<T>(
  formData: FormData,
  zodSchema: z.Schema<T>,
  successCallback: (data: T) => unknown,
  errorCallback: (errors: TFieldErrors) => unknown
) {
  const result = zodSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    const errors: TFieldErrors = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      errors[path] = issue.message;
    });
    return errorCallback(errors);
  }

  return successCallback(result.data);
}
