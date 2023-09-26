// Essentials
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Models
import Lounge from '@models/Lounge';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const GET = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const userId = request.nextUrl.searchParams.get('userId');

    if (!id || !userId) {
      const status = HttpStatusCodes.BAD_REQUEST;
      return NextResponse.json({ message: 'Invalid IDs', status }, { status });
    }

    await connectToMongoDB();

    let loungeQuery = { _id: new mongoose.Types.ObjectId(id) };
    const lounge = await Lounge.findOne(loungeQuery);
    if (!lounge) {
      const status = HttpStatusCodes.NOT_FOUND;
      return NextResponse.json({ message: 'Lounge does not exist', status }, { status });
    }
    
    let role = 'member';
    if (lounge.adminId.toString() === userId) role = 'admin';
    else if (lounge.modIds.includes(userId)) role = 'mod';

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Check for user existence complete', status, result: role }, { status });
  } catch (error) {
    return NextResponse.json(
      { message: 'Encountered error while checking for user existence' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};