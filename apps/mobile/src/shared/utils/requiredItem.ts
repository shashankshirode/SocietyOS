export function getRequiredItem<Item>(
  items: readonly Item[],
  index: number,
  collectionName: string,
): Item {
  const item = items[index];
  if (item === undefined) {
    throw new Error(`${collectionName} does not contain an item at index ${index}`);
  }
  return item;
}
