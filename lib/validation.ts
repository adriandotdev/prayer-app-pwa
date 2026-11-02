const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A malformed id would make Postgres reject the uuid; callers treat it as not found. */
export function isUuid(value: string) {
  return UUID.test(value);
}

/** A form field that must hold a uuid, or null. Keeps malformed ids from reaching Postgres. */
export function formId(formData: FormData, key = "id") {
  const value = formData.get(key);
  return typeof value === "string" && isUuid(value) ? value : null;
}
