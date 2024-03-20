
import { NuxtAuthHandler } from '#auth'
import GithubProvider from 'next-auth/providers/github'

export default NuxtAuthHandler({
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: 'Iv1.b4722bca051b79db',
      clientSecret: '55802650363c58e934a33a9d859443f7b2f9c28c',
    }),
  ],
})