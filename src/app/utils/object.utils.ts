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
