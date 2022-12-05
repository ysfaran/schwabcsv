export const groupBy = <K, V>(
  array: V[],
  predicate: (value: V, index: number, array: V[]) => K
) => {
  return array.reduce((groupsMap, value, index, arr) => {
    const groupKey = predicate(value, index, arr);
    const group = groupsMap.get(groupKey);

    if (group) {
      group.push(value);
    } else {
      groupsMap.set(groupKey, [value]);
    }

    return groupsMap;
  }, new Map<K, V[]>());
};
