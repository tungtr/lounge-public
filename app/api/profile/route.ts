// Essentials
import { NextRequest, NextResponse } from 'next/server';

// Models
import User from '@models/User';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const PATCH = async (request: NextRequest) => {
  try {
    const { email, username, avatar } = await request.json();

    await connectToMongoDB();
    const user = await User.findOne({ email });
    if (user) {
      user.username = username;
      if (avatar.url.length > 0 && avatar.path.length > 0) {
        user.avatar = avatar;
      }
      await user.save();

      const status = HttpStatusCodes.OK;
      return NextResponse.json({ message: 'Updated profile successfully', status, user }, { status });
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