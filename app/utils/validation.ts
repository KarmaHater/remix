import type z from "zod";

type FormFields = {
  [key: string]: FormDataEntryValue | FormDataEntryValue[];
};

function objectifyFormData(formData: FormData) {
  const formFields: FormFields = {};

  formData.forEach((value, name) => {
    const isArrayField = name.endsWith("[]");
    const fieldName = isArrayField ? name.slice(0, -2) : name;
    if (!(fieldName in formFields)) {
      formFields[fieldName] = isArrayField ? formData.getAll(name) : value;
    }
  });
  return formFields;
}

type TFieldErrors = Record<string, string>;

export function formValidation<T>(
  formData: FormData,
  zodSchema: z.Schema<T>,
  successCallback: (data: T) => unknown,
  errorCallback: (errors: TFieldErrors) => unknown
) {
  const fields = objectifyFormData(formData);
  const result = zodSchema.safeParse(fields);

  console.log(result, "result");

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
