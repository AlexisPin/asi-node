export const generate_id = (id1: number, id2: number) => {
  return [id1, id2].sort().join('_');
};
