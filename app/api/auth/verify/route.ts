// Essentials
import { NextRequest, NextResponse } from 'next/server';

// Models
import User from '@models/User';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';
import { verifyToken } from '@utils/helpers/token';

export const POST = async (request: NextRequest) => {
  try {
    const { token } = await request.json();
    const jwtPayload = verifyToken(token);
    if (typeof jwtPayload === 'string') {
      const status = HttpStatusCodes.BAD_REQUEST;
      return NextResponse.json({ message: 'Bad request', status }, { status });
    }

    const { email } = jwtPayload;

    await connectToMongoDB();
    const user = await User.findOne({ email });
    if (user) {
      user.isVerified = true;
      await user.save();

      const status = HttpStatusCodes.OK;
      return NextResponse.json({ message: 'Email verification successful', status, user }, { status });
    } else {
      const status = HttpStatusCodes.NOT_FOUND;
      return NextResponse.json({ message: 'User cannot be found', status, user }, { status });
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Encountered error during email verification' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};