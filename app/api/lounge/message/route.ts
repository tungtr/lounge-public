// Essentials
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Models
import Message from '@models/Message';
import User from '@models/User';

// Services
import { pusherServer } from '@services/third-party/pusher';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import Globals from '@utils/constants/global/Miscellaneous';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const GET = async (request: NextRequest) => {
  try {
    const loungeId = request.nextUrl.searchParams.get('loungeId');
    const offsetStr = request.nextUrl.searchParams.get('offset');
    const isPrior = request.nextUrl.searchParams.get('isPrior');

    if (!loungeId || !offsetStr) {
      const status = HttpStatusCodes.BAD_REQUEST;
      return NextResponse.json({ message: 'Bad request', status }, { status });
    }
    const offset = Number(offsetStr);

    let messageQuery = {
      loungeId: new mongoose.Types.ObjectId(loungeId)
    };
    const messageCount = await Message.count(messageQuery);

    await connectToMongoDB();
    const m = messageCount - offset; const limit = Globals.DEFAULT_MESSAGE_LIST_LIMIT;
    const messageList = await Message.find({
      ...messageQuery,
      order: isPrior ? { $gte: m - limit, $lt: m }
        : { $gte: m, $lt: m + limit }
    });
    const resultList = await Promise.all(messageList.map(async (message) => {
      const user = await User.findOne({ _id: new mongoose.Types.ObjectId(message.userId) });
      let reply = null;
      if (message.replyId) {
        const fullReply = await Message.findOne({ _id: new mongoose.Types.ObjectId(message.replyId) });
        if (fullReply) {
          const replyUser = await User.findOne({ _id: new mongoose.Types.ObjectId(fullReply.userId) });
          let content = `"${fullReply.content}"`;
          if (fullReply.content.length === 0) {
            if (fullReply.image) content = `${replyUser.username} sent an image`;
            else if (fullReply.gifKey) content = `${replyUser.username} sent a GIF`
          }
          reply = {
            order: Number(fullReply.order),
            username: replyUser.username,
            content
          }
        }
      }
      return {
        id: message.id,
        order: message.order,
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          avatar: user.avatar
        },
        content: message.content,
        image: message.image,
        gifKey: message.gifKey,
        reply,
        reactionList: message.reactions,
        createdAt: message.createdAt
      }
    }));

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Retrieved chat messages successfully', status, resultList }, { status });
  } catch (error) {
    return NextResponse.json(
      { message: 'Encountered error while retrieving chat messages' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { loungeId, userId, content, image, gifKey, reply } = await request.json();

    await connectToMongoDB();
    const messageTotal = await Message.count({ loungeId });
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
    let replyContent = '';
    if (reply) {
      replyContent = reply.content;
      if (replyContent.length === 0) {
        if (reply.image) replyContent = `${reply.user.username} sent an image`;
        else if (reply.gifKey) replyContent = `${reply.user.username} sent a GIF`
      }
    }

    await pusherServer.trigger(loungeId, 'incoming-message', {
      order: messageTotal,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar
      },
      content,
      image,
      gifKey,
      reply: reply ? {
        order: reply.order,
        username: reply.user.username,
        content: replyContent
      } : null,
      reactionList: [],
      createdAt: new Date()
    });

    await Message.create({
      loungeId,
      order: messageTotal,
      userId,
      content,
      image,
      gifKey,
      replyId: reply ? reply.id : null,
      reactions: []
    });

    const status = HttpStatusCodes.CREATED;
    return NextResponse.json({ message: 'Sent message successfully', status }, { status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Encountered error while updating chat log' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};