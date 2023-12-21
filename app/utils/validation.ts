import type z from "zod";

export function formValidation<T>(
  formData: FormData,
  zodSchema: z.Schema<T>,
  successCallback: (data: T) => unknown,
  errorCallback: (errors: unknown) => unknown
) {
  const result = zodSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const errors = result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      return { [path]: issue.message };
    });
    return errorCallback(errors);
  }

  return successCallback(result.data);
}
