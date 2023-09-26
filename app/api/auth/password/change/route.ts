// Essentials
import { NextRequest, NextResponse } from 'next/server';
import { hash, compare } from 'bcrypt';

// Models
import User from '@models/User';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const POST = async (request: NextRequest) => {
  try {
    const { email, oldPassword, newPassword } = await request.json();

    await connectToMongoDB();
    const user = await User.findOne({ email }).select('+password');
    if (user) {
      const isPasswordCorrect = await compare(oldPassword, user.password);

      if (isPasswordCorrect) {
        const hashedNewPassword = await hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        const status = HttpStatusCodes.OK;
        return NextResponse.json({ message: 'Changed password successfully', status }, { status });
      } else {
        const status = HttpStatusCodes.BAD_REQUEST;
        return NextResponse.json({ message: 'Incorrect password', status }, { status });
      }
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