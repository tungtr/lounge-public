// Essentials
import NextAuth, { NextAuthOptions } from 'next-auth';
import { connectToMongoDB } from '@utils/helpers/mongodb';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';

// Interfaces
import { UserITF } from '@interfaces/AuthITF';

// Models
import User from '@models/User';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await connectToMongoDB();

        const user = await User.findOne({ email: credentials?.email }).select('+password');
        if (!user) throw new Error('InvalidCredentials');
        
        const isPasswordCorrect = await compare(credentials!.password, user.password);
        if (!isPasswordCorrect) throw new Error('InvalidCredentials');
        
        if (!user.isVerified) throw new Error('UnverifiedUser');

        return user;
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user)
      return token
    },
    session: async ({ session, token }) => {
      const user = token.user as UserITF
      session.user = user
      return session
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };