import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignInCredentials } from "./app/types";

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, request) {
        const { email, password } = credentials as SignInCredentials;
        //Send request to your api route where you can sign in your user and send error or success response to this function

        const { user, error } = await fetch("http://localhost:3000/api/users/signin", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }).then(async (res) => await res.json());

        if (error) return error;

        return { ...user };
      },
    }),
  ],
  callbacks: {
    async jwt(params) {
      console.log("jwt: params=>", params);
      if (params.user) {
        params.token.user = params.user;
      }
      return params.token;
    },
    async session(params) {
      const user = params.token.user;
      console.log("session: params=>", params);
      if (user) {
        params.session.user = { ...params.session.user, ...user };
      }
      return params.session;
    },
  },
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);
