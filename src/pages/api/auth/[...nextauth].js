import { db } from "@/lib/kysely"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'

export const authOptions = {
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
              .select(['admin.username', 'admin.password'])
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
