// Essentials
import { NextRequest, NextResponse } from 'next/server';

// Models
import Lounge from '@models/Lounge';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const POST = async (request: NextRequest) => {
  try {
    const { joinCode, userId } = await request.json();

    await connectToMongoDB();
    
    const lounge = await Lounge.findOne({ joinCode });
    if (!lounge) {
      const status = HttpStatusCodes.NOT_FOUND;
      return NextResponse.json({ message: 'Lounge not found', status }, { status });
    }
    if (lounge.adminId.toString() === userId ||
      lounge.modIds.includes(userId) || lounge.memberIds.includes(userId)) {
      const status = HttpStatusCodes.CONFLICT;
      return NextResponse.json({ message: 'You\'ve already joined the lounge', status }, { status });
    }

    lounge.memberIds = [...lounge.memberIds, userId];
    await lounge.save();

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Joined lounge successfully', status, loungeId: lounge._id.toString() }, { status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Encountered error while joining lounge' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};