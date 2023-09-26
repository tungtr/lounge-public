// Essentials
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import randomstring from 'randomstring';

// Models
import Lounge from '@models/Lounge';
import Subject from '@models/Subject';
import User from '@models/User';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const GET = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      const status = HttpStatusCodes.BAD_REQUEST;
      return NextResponse.json({ message: 'Invalid lounge ID', status }, { status });
    }

    let loungeQuery = { _id: new mongoose.Types.ObjectId(id) };

    await connectToMongoDB();
    const lounge = await Lounge.findOne(loungeQuery);
    const subject = await Subject.findOne({ _id: lounge.subjectId });
    const admin = await User.findOne({ _id: lounge.adminId });
    let result: any = {
      id: lounge._id,
      name: lounge.name,
      subject: {
        id: subject._id,
        name: subject.name
      },
      description: lounge.description,

      joinCode: lounge.joinCode,
      visibility: lounge.visibility,

      admin,
      memberCount: lounge.memberIds.length,

      avatar: lounge.avatar,
      cover: lounge.cover,

      createdAt: lounge.createdAt,
      updatedAt: lounge.updatedAt
    };

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Retrieved lounge successfully', status, result }, { status });
  } catch (error) {
    return NextResponse.json(
      { message: 'Encountered error while retrieving lounge' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { name, subjectId, visibility, description, adminId } = await request.json();

    await connectToMongoDB();
    // Get join code
    let joinCode = '';
    while (true) {
      joinCode = randomstring.generate({
        length: 8,
        capitalization: 'uppercase'
      });
      const loungeWithCode = await Lounge.findOne({ joinCode });
      if (!loungeWithCode) break;
    }

    // Create new lounge
    const image = { url: '', path: '' };
    const lounge = await Lounge.create({
      name, subjectId, description,
      adminId, modIds: [], memberIds: [],
      joinCode, visibility,
      avatar: image,
      cover: image
    });

    const status = HttpStatusCodes.CREATED;
    return NextResponse.json({ message: 'Created new lounge successfully', status, lounge }, { status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Encountered error while creating new lounge' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const { id, name, subjectId, visibility, description, avatar, cover } = await request.json();

    await connectToMongoDB();
    const lounge = await Lounge.findOne({ _id: id });
    if (lounge) {
      lounge.name = name;
      lounge.subjectId = subjectId,
      lounge.visibility = visibility,
      lounge.description = description;
      if (avatar.url.length > 0 && avatar.path.length > 0) {
        lounge.avatar = avatar;
      }
      if (cover.url.length > 0 && cover.path.length > 0) {
        lounge.cover = cover;
      }
      await lounge.save();

      const status = HttpStatusCodes.OK;
      return NextResponse.json({ message: 'Updated lounge successfully', status, lounge }, { status });
    } else {
      const status = HttpStatusCodes.NOT_FOUND;
      return NextResponse.json({ message: 'Lounge cannot be found', status }, { status });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Encountered error while updating lounge' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};