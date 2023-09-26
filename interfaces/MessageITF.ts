// Interfaces
import { MemberITF } from '@interfaces/LoungeITF';
import { ImageITF } from '@interfaces/ImageITF';

export interface MessageITF {
  id: string;
  order: number;
  user: MemberITF;
  content: string;
  image: ImageITF | null;
  gifKey: string | null;
  reply: ReplyITF | null;
  reactionList: ReactionITF[];
  createdAt: Date;
};

export interface ReplyITF {
  order: number;
  username: string;
  content: string;
};

export interface CoreReactionITF {
  name: string;
  url: string;
}

export interface ReactionITF extends CoreReactionITF {
  memberList: {
    email: string,
    username: string
  }[],
};

export interface PatchReactionITF extends CoreReactionITF {
  user: {
    email: string,
    username: string
  }
}

export interface NewReactionITF {
  order: number,
  reaction: PatchReactionITF
}

export interface GetMessageListITF {
  loungeId: string;
  offset: number;
  messageList: MessageITF[];
  messageListOffset: number;
  isPrior: boolean; // load earlier messages if isPrior and vice versa
};

export interface GetMessageListTotalITF {
  loungeId: string;
};

export interface SendMessageITF {
  loungeId: string;
  content: string;
  image: ImageITF | null;
  gifKey: string | null;
  reply: MessageITF | null;
}

export interface ReactToMessageITF {
  loungeId: string;
  order: number;
  newReaction: PatchReactionITF;
}