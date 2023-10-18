export const wait = async (ms: number): Promise<void> => {
  await new Promise((_) => setTimeout(_, ms));
};
