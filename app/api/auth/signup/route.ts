// Essentials
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import axios from 'axios';

// Models
import User from '@models/User';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const POST = async (request: NextRequest) => {
  try {
    const { email, username, password } = await request.json();

    await connectToMongoDB();
    const userExists = await User.findOne({ email });
    if (userExists) {
      const status = HttpStatusCodes.CONFLICT;
      return NextResponse.json({ message: 'User already exists', status }, { status });
    } else {
      // Create user in database
      const hashedPassword = await hash(password, 10);
      const avatar = { url: '', path: '' };
      const user = await User.create({ email, username, password: hashedPassword, avatar, isVerified: false });

      // Create new history
      await axios.post(`/api/history`, { userId: user._id.toString() })
      
      // Send verification email
      await axios.post(`/api/auth/verify/send`, { email });

      const status = HttpStatusCodes.CREATED;
      return NextResponse.json({ message: 'Sign-up successful', status, user }, { status });
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Encountered error during user sign-up' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};