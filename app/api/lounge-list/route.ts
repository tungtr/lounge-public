// Essentials
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Models
import History from '@models/History';
import Lounge from '@models/Lounge';
import Subject from '@models/Subject';
import User from '@models/User';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import Globals from '@utils/constants/global/Miscellaneous';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const GET = async (request: NextRequest) => {
  try {
    const filter = request.nextUrl.searchParams.get('filter');
    const loungeUserId = request.nextUrl.searchParams.get('loungeUserId');
    let skip = Number(request.nextUrl.searchParams.get('skip'));
    let limit = Number(request.nextUrl.searchParams.get('limit'));
    let search = request.nextUrl.searchParams.get('search');

    if (!skip) skip = Globals.DEFAULT_SKIP;
    if (!limit) limit = Globals.DEFAULT_LIMIT;

    let loungeQuery: any = { // filter: 'discover'
      visibility: 'public',
    };
    if (loungeUserId) {
      loungeQuery.adminId = { $not: { $eq: new mongoose.Types.ObjectId(loungeUserId) } };
      loungeQuery.memberIds = { $nin: [loungeUserId] };
      loungeQuery.modIds = { $nin: [loungeUserId] };
    }

    let history = null;
    if (loungeUserId && filter === 'recent') history = await History.findOne({ userId: new mongoose.Types.ObjectId(loungeUserId) });
    switch (filter) {
      case 'my':
        loungeQuery = { adminId: loungeUserId };
        break;
      case 'joined':
        loungeQuery = { $or: [ { memberIds: loungeUserId }, { modIds: loungeUserId } ] };
        break;
      case 'recent':
        loungeQuery = { _id: { $in: history.visitedLoungeIds } }
        break;
    };
    if (search && search.length > 0) {
      loungeQuery.$text = { $search: `${search}` }
    }

    await connectToMongoDB();
    const loungeInitList = await Lounge.find(loungeQuery).skip(skip).limit(limit);
    const loungeTotal = await Lounge.find(loungeQuery).count();

    let loungeList = await Promise.all(loungeInitList.map(async (lounge) => {
      const subject = await Subject.findOne({ _id: lounge.subjectId });
      const admin = await User.findOne({ _id: lounge.adminId });
      
      return {
        id: lounge._id,
        name: lounge.name,
        subject: {
          id: subject._id,
          name: subject.name
        },
        joinCode: lounge.joinCode,
        visibility: lounge.visibility,
        description: lounge.description,

        admin,
        memberCount: lounge.memberIds.length + lounge.modIds.length + 1,

        avatar: lounge.avatar,
        cover: lounge.cover
      };
    }));

    if (filter === 'recent') {
      const oldList = loungeList;
      loungeList = history.visitedLoungeIds.map((loungeId: string) => {
        return oldList.find(lounge => lounge.id.toString() === loungeId);
      })
    }

    const resultList = {
      list: loungeList,
      total: loungeTotal
    }

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Retrieved list of Lounges successfully', status, resultList }, { status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Encountered error while retrieving list of lounges' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};