import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter" 
import { prisma } from "@/lib/prisma" 
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // <--- 1. MUST BE JWT for Credentials to work
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }), 
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" , placeholder : "***********"}
      },
      authorize: async (credentials) => {
        if(!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }
        // Add your own logic here to find the user and verify the password
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if(!user || !user.password) {
          throw new Error("No user found with the given email")
        }

        const isCorrectPassword = await bcrypt.compare(credentials.password, user.password)

        if(!isCorrectPassword) {
          throw new Error("Incorrect password")
        }

        return user;
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, 
  callbacks: {
    // This helper makes the user ID available to your dashboard later
    async jwt({ token, user }) {  
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
}