export function omitBy(obj: { [key: string]: any }, value: any) {
  return Object.entries(obj)
    .filter(([_, val]) => val !== value)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export function omitByAndNullify(obj: { [key: string]: any }, value: any) {
  const newObject = Object.entries(obj)
    .filter(([_, val]) => val !== value)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return Object.entries(newObject).length ? newObject : null;
}

export function toMap<K, V>(list: V[], keyGetter: (input: V) => K): Map<K, V> {
  const map = new Map();

  for (const item of list) {
    const key = keyGetter(item);
    map.set(key, item);
  }

  return map;
}
