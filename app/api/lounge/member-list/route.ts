// Essentials
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Interfaces
import { MemberITF } from '@interfaces/LoungeITF';

// Models
import Lounge from '@models/Lounge';
import User from '@models/User';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';

const convertToMember = (user: MemberITF) => {
  return {
    _id: user._id,
    email: user.email,
    username: user.username,
    avatar: user.avatar
  };
};

export const GET = async (request: NextRequest) => {
  try {
    const loungeId = request.nextUrl.searchParams.get('loungeId');
    if (!loungeId) {
      const status = HttpStatusCodes.BAD_REQUEST;
      return NextResponse.json({ message: 'Invalid lounge ID', status }, { status });
    }

    await connectToMongoDB();

    const lounge = await Lounge.findOne({ _id: new mongoose.Types.ObjectId(loungeId) });
    const admin = await User.findOne({ _id: lounge.adminId });
    const modList = await User.find({ _id: { $in: lounge.modIds } });
    const memberList = await User.find({ _id: { $in: lounge.memberIds } });

    const memberCollection = {
      admin: convertToMember(admin),
      modList: modList.map(mod => convertToMember(mod)),
      memberList: memberList.map(member => convertToMember(member))
    };

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Retrieved list of members successfully', status, memberCollection }, { status });
  } catch (error) {
    return NextResponse.json(
      { message: 'Encountered error while retrieving list of lounges' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};