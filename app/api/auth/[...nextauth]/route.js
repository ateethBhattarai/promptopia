import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import User from "@models/user";

import { connectToDb } from "@utils/database";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async session({ session }) { //to know which user is online session is used
            const sessionUser = await User.findOne({
                email: session.user.email
            })

            session.user.id = sessionUser._id.toString();

            return session;
        },
        async signIn({ profile }) {
            try {
                await connectToDb();

                //check if user already exists
                const userExists = await User.findOne({
                    email: profile.email
                });

                //check if user not exist, create a new user
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        //username: profile.name.replace(" ", "").toLowerCase(),
                        username: profile.email.replace("@gmail.com", "").toLowerCase(), //to make every user name unique
                        image: profile.picture
                    })
                }

                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    }
})

export { handler as GET, handler as POST };