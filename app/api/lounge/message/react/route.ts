// Essentials
import { NextRequest, NextResponse } from 'next/server';

// Models
import Message from '@models/Message';

// Services
import { pusherServer } from '@services/third-party/pusher';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { connectToMongoDB } from '@utils/helpers/mongodb';

export const PATCH = async (request: NextRequest) => {
  try {
    const { loungeId, order, newReaction } = await request.json();

    await pusherServer.trigger(loungeId, 'incoming-reaction', {
      order,
      reaction: {
        name: newReaction.name,
        url: newReaction.url,
        user: newReaction.user
      }
    });

    await connectToMongoDB();

    const newReactionObject = {
      name: newReaction.name,
      url: newReaction.url,
      memberList: [newReaction.user]
    };
    const message = await Message.findOne({ loungeId, order });
    if (message.reactions) {
      const reaction = message.reactions.find((react: any) => react.name === newReaction.name);
      const user = newReaction.user;

      if (reaction) {
        const idx = message.reactions.map((react: any) => react.name).indexOf(reaction.name);
        const members = message.reactions[idx].memberList;

        // Remove user from reaction if they have already reacted
        if (members.find((member: any) => member.email === user.email)) {
          console.log('member removed from reaction')
          const userIdx = members.map((member: any) => member.email).indexOf(user.email);
          const newReactions = [
            ...message.reactions.slice(0, idx),
            {
              name: message.reactions[idx].name,
              url: message.reactions[idx].url,
              memberList: [...members.slice(0, userIdx), ...members.slice(userIdx + 1)]
            },
            ...message.reactions.slice(idx + 1)
          ]
          message.reactions = newReactions;
          // Remove the reaction if there's no user left
          if (message.reactions[idx].memberList.length === 0) {
            console.log('reaction removed from message')
            const reactions = message.reactions;
            message.reactions = [...reactions.slice(0, idx), ...reactions.slice(idx + 1)];
          }
        } 
        // New member
        else {
          console.log('new member in reaction');
          const newReactions = [
            ...message.reactions.slice(0, idx),
            {
              name: message.reactions[idx].name,
              url: message.reactions[idx].url,
              memberList: [...members, user]
            },
            ...message.reactions.slice(idx + 1)
          ]
          message.reactions = newReactions;
        }
      } else {
        console.log('new reaction in message')
        message.reactions = [...message.reactions, newReactionObject];
      }
    } else {
      console.log('init reaction in message')
      message.reactions = [newReactionObject];
    }
    await message.save();

    const status = HttpStatusCodes.OK;
    return NextResponse.json({ message: 'Reacted to message successfully', status }, { status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Encountered error while reacting to message' },
      { status: HttpStatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};