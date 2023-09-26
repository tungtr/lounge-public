// Essentials
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';

// Models
import User from '@models/User';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';
import { verifyToken } from '@utils/helpers/token';

export const POST = async (request: NextRequest) => {
  try {
    const { token, password } = await request.json();
    const jwtPayload = verifyToken(token);
    if (typeof jwtPayload === 'string') {
      const status = HttpStatusCodes.BAD_REQUEST;
      return NextResponse.json({ message: 'Bad request', status }, { status });
    }

    const email = jwtPayload.email;

    await connectToMongoDB();
    const user = await User.findOne({ email });
    if (user) {
      const hashedPassword = await hash(password, 10);
      user.password = hashedPassword;
      await user.save();

      const status = HttpStatusCodes.OK;
      return NextResponse.json({ message: 'Password reset successful', status }, { status });
    } else {
      const status = HttpStatusCodes.NOT_FOUND;
      return NextResponse.json({ message: 'User cannot be found', status }, { status });
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Encountered error while resetting password' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};