// Essentials
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Models
import History from '@models/History';
import Lounge from '@models/Lounge';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const PATCH = async (request: NextRequest) => {
  try {
    const { loungeId, userId, type } = await request.json();

    await connectToMongoDB();
    
    // Update member
    const lounge = await Lounge.findOne({ _id: new mongoose.Types.ObjectId(loungeId) });
    if (!lounge) {
      const status = HttpStatusCodes.NOT_FOUND;
      return NextResponse.json({ message: 'Lounge not found', status, type: 'Lounge' }, { status });
    }

    if (lounge.memberIds.includes(userId)) {
      const idx = lounge.memberIds.indexOf(userId);
      const memberIds = lounge.memberIds;
      lounge.memberIds = [...memberIds.slice(0, idx), ...memberIds.slice(idx + 1, memberIds.length)];

      if (type === 'switch') lounge.modIds = [...lounge.modIds, userId];
    } else if (lounge.modIds.includes(userId)) {
      const idx = lounge.modIds.indexOf(userId);
      const modIds = lounge.modIds;
      lounge.modIds = [...modIds.slice(0, idx), ...modIds.slice(idx + 1, modIds.length)];

      if (type === 'switch') lounge.memberIds = [...lounge.memberIds, userId];
    } else {
      const status = HttpStatusCodes.NOT_FOUND;
      return NextResponse.json({ message: 'Lounge not found', status, type: 'Member' }, { status });
    }
    await lounge.save();

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Switched member\'s role successfully', status }, { status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Encountered error while switching member\'s role' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};