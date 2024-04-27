export async function getQueryParams(key: string, qs: object): Promise<string> {
  // @ts-ignore
  return qs[key]
}
