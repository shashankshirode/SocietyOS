type Present<Value> = Value extends void ? never : Value;

export function includeWhenPresent<Key extends PropertyKey, const Value>(
  key: Key,
  value?: Value,
): Partial<Record<Key, Present<Value>>> {
  if (value === undefined) {
    return {};
  }
  const property: Partial<Record<Key, Present<Value>>> = {};
  property[key] = value as Present<Value>;
  return property;
}
