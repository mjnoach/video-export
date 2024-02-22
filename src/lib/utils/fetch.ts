export async function fetchApi(options: RequestInit = {}) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api`, {
    ...options,
    // headers: {
    //   'Content-Type': 'application/json',
    //   ...options.headers,
    // },
  }).catch((e) => {
    console.error(e)
  })
}
