import { getContext } from '@nuxt/test-utils'

export function listenToNuxtDocker () {
  const ctx = getContext()

  // Nuxt docker client port is 8080
  // const port = process.env.PORT

  ctx.url = process.env.URL// + port

  // await ctx.nuxt.listen(port)
}

export function url (path: string) {
  const ctx = getContext()

  if (!ctx.url) {
    throw new Error('server is not enabled')
  }

  return ctx.url + path
}
