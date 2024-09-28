import prisma from "@/app/libs/prismadb";
import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";


export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text'},
                password: {label: 'password', type: 'password'}
            },
            async authorize(credentials){  // checking if the provided credentials are correct
                if (!credentials?.email || !credentials?.password){
                    throw new Error('Invalid credentials')
                }

                const user = await prisma.user.findUnique({  // getting the user information
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user?.hashedPassword){    // if the user does not have a hashed password or no user at all throw an error
                    throw new Error ('Invalid credentials')
                }

                const isCorrectPassowrd = await bcrypt.compare( //comparing the users password
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassowrd){
                    throw new Error('Invalid credentials');
                }
                return user;
            }
        })
    ],

    pages: {
        signIn: '/',    // if there is an arror at any point redirect to the main page
    },
    debug: process.env.NODE_ENV == 'development',

    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth (authOptions);