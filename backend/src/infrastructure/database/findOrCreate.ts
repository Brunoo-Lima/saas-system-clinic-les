export async function findOrCreate(
  tx: any,
  table: any,
  filters: Array<any>,
  values: Record<string, any>
): Promise<any> {
  const existing = await tx.select().from(table).where(...filters).limit(1);
  if (existing.length > 0) return existing[0];

  const [inserted] = await tx.insert(table).values(values).returning("*");
  return inserted;
}
