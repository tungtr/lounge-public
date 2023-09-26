// Essentials
import { NextRequest, NextResponse } from 'next/server';

// Models
import Subject from '@models/Subject';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const GET = async (request: NextRequest) => {
  try {
    await connectToMongoDB();
    const subjectList = await Subject.find();

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Retrieved list of Subjects successfully', status, subjectList }, { status });
  } catch (error) {
    return NextResponse.json(
      { message: 'Encountered error while retrieving list of subjects' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};