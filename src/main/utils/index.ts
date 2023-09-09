export const delay = async (n: number) => {
  await new Promise((resolve) => setTimeout(resolve, n))
}
