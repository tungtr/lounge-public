// Essentials
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Models
import Message from '@models/Message';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const GET = async (request: NextRequest) => {
  try {
    const loungeId = request.nextUrl.searchParams.get('loungeId');

    if (!loungeId) {
      const status = HttpStatusCodes.BAD_REQUEST;
      return NextResponse.json({ message: 'Invalid lounge Id', status }, { status });
    }

    await connectToMongoDB();
    const messageQuery = { loungeId: new mongoose.Types.ObjectId(loungeId) };
    const result = await Message.count(messageQuery);

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Retrieved chat messages total successfully', status, result }, { status });
  } catch (error) {
    return NextResponse.json(
      { message: 'Encountered error while retrieving chat messages total' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};