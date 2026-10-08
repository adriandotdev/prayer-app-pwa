const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A malformed id would make Postgres reject the uuid; callers treat it as not found. */
export function isUuid(value: string) {
  return UUID.test(value);
}
