// Essentials
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Models
import History from '@models/History';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import Globals from '@utils/constants/global/Miscellaneous';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const POST = async (request: NextRequest) => {
  try {
    const { userId } = await request.json();

    await connectToMongoDB();

    const history = await History.create({
      userId, visitedLoungeIds: []
    });

    const status = HttpStatusCodes.CREATED;
    return NextResponse.json({ message: 'Created new history successfully', status, history }, { status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Encountered error while creating new history' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const { userId, loungeId, type } = await request.json();

    await connectToMongoDB();

    const history = await History.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!history) {
      const status = HttpStatusCodes.NOT_FOUND;
      return NextResponse.json({ message: 'History cannot be found', status }, { status });
    }
    
    if (!['kick', 'leave'].includes(type)) {
      if (history.visitedLoungeIds.length > 0 && history.visitedLoungeIds[0] === loungeId) {
        const status = HttpStatusCodes.OK;
        return NextResponse.json({ message: 'No need for history update', status }, { status });
      }
      if (history.visitedLoungeIds.length > Globals.DEFAULT_LIMIT) {
        const list = history.visitedLoungeIds;
        history.visitedLoungeIds = list.slice(0, list.length - 1);
      }
    }

    // Run regardless of adding or kicking
    if (history.visitedLoungeIds.includes(loungeId)) {
      const list = history.visitedLoungeIds;
      const idx = list.indexOf(list.find((lounge: string) => lounge === loungeId));
      history.visitedLoungeIds = [
        ...list.slice(0, idx), ...list.slice(idx + 1)
      ];
    }

    if (!['kick', 'leave'].includes(type)) {
      history.visitedLoungeIds = [loungeId, ...history.visitedLoungeIds];
    }
    await history.save();

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Updated history successfully', status }, { status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Encountered error while updating history' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};