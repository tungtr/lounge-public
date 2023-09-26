// Essentials
import { NextRequest, NextResponse } from 'next/server';

// Models
import User from '@models/User';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const GET = async (request: NextRequest) => {
  try {
    const email = request.nextUrl.searchParams.get('email');

    await connectToMongoDB();
    const user = await User.findOne({ email });
    if (!user) {
      const status = HttpStatusCodes.NOT_FOUND;
      return NextResponse.json({ message: 'User cannot be found', status }, { status });
    }

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Retrieved user successfully', status, user }, { status });
  } catch (error) {
    return NextResponse.json(
      { message: 'Encountered error while retrieving user' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};