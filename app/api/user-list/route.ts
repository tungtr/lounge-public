// Essentials
import { NextRequest, NextResponse } from 'next/server';

// Models
import User from '@models/User';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import Globals from '@utils/constants/global/Miscellaneous';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const GET = async (request: NextRequest) => {
  try {
    let skip = Number(request.nextUrl.searchParams.get('skip'));
    let limit = Number(request.nextUrl.searchParams.get('limit'));
    let search = request.nextUrl.searchParams.get('search');

    if (!skip) skip = Globals.DEFAULT_SKIP;
    if (!limit) limit = Globals.DEFAULT_LIMIT;

    let userQuery : any = {};
    if (search && search.length > 0) {
      userQuery.$text = { $search: `${search}` }
    }

    await connectToMongoDB();
    const userList = await User.find(userQuery).skip(skip).limit(limit);
    const userTotal = await User.find(userQuery).count();

    const resultList = {
      list: userList,
      total: userTotal
    }

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Retrieved list of users', status, resultList }, { status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Encountered error while retrieving list of users' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};