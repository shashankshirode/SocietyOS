export function getRequiredProperty<Container, Key extends keyof Container>(
  container: Container,
  key: Key,
  containerName: string,
): NonNullable<Container[Key]> {
  const value = container[key];
  if (value === undefined || value === null) {
    throw new Error(`${containerName} does not contain ${String(key)}`);
  }
  return value;
}
