import { db } from "@/lib/kysely"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'

export const authOptions = {
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {      
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken
      // userId is token.sub when using CredentialsProvider
      session.user.id = token.sub
            
      const userFromDb = await db.selectFrom('admin')
        .where('id', '=', token.sub)
        .select(['username', 'permission'])
        .executeTakeFirst()

      if (userFromDb) {
        session.user.name = userFromDb.username
        session.user.permission = userFromDb.permission
      } else {
        session.user.name = ''
        session.user.permission = []
      }
      return session
    }
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (req.query) {
          const username = req.query.username
          const password = req.query.password

          try {
            const rows = await db.selectFrom('admin')
              .where('admin.username', '=', username)
              .select(['admin.username', 'admin.password', 'admin.id'])
              .execute()
  
            if (rows.length > 0) {
              const user = rows[0]
              const isPasswordMatch = await bcrypt.compare(password, user.password)
              if (isPasswordMatch) {              
                return user
              }
            }
          } catch(e) {
            console.log(e);
          }
        }     
        return null
      }
    })
  ],
}
export default NextAuth(authOptions)
