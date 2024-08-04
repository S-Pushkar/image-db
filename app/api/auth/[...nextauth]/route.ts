import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/db/connect";
import users from "@/schemas/users";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) {
        return false;
      }

      try {
        await dbConnect();
        const existingUser = await users.findOne({ email: user.email });

        if (existingUser) {
          return existingUser.password === "";
        }

        if (!user.name) {
          user.name = user.email.split("@")[0];
        }

        const newUser = new users({
          name: user.name,
          email: user.email,
        });

        await newUser.save();
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
