// Essentials
import { NextRequest, NextResponse } from 'next/server';

// Models
import User from '@models/User';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';
import { sendMail } from '@utils/helpers/mailer';
import { generateToken } from '@utils/helpers/token';

export const POST = async (request: NextRequest) => {
  try {
    const { email } = await request.json();

    // Check if user exists
    await connectToMongoDB();
    const userExists = await User.findOne({ email });
    if (!userExists) {
      const status = HttpStatusCodes.NOT_FOUND;
      return NextResponse.json({ message: 'User not found', status }, { status });
    }

    const token = generateToken({ email }, '5m');
    await sendMail({
      type: 'forgot-password',
      to: email,
      url: `${process.env.NEXTAUTH_URL}/forgot-password?token=${token}`
    });

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Reset password email sent', status }, { status });
  } catch (error) {
    return NextResponse.json(
      { message: 'Encountered error while sending reset password email' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};