// Interfaces
import { UserITF } from '@interfaces/UserITF';
import { ImageITF } from '@interfaces/ImageITF';
import { MessageITF } from '@interfaces/MessageITF';
import { SubjectLoungeITF as SubjectITF } from '@interfaces/SubjectITF';
import { GetListITF } from '@interfaces/MiscITF';

// Main
export interface LoungeITF {
  id: string;
  name: string;
  subject: SubjectITF;
  joinCode: string;
  visibility: string;
  description: string;

  admin: UserITF;
  memberCount: number;

  avatar: ImageITF;
  cover: ImageITF;

  createdAt: Date;
  updatedAt: Date;
};

export interface MemberITF {
  _id: string;
  email: string;
  username: string;
  avatar: ImageITF;
};

export interface MemberCollectionITF {
  admin: MemberITF;
  modList: MemberITF[];
  memberList: MemberITF[];
};

// For APIs
export interface CreateLoungeITF {
  name: string;
  subjectId: string;
  visibility: string;
  description: string;
  loungeTrigger: boolean;
};

export interface JoinLoungeITF {
  joinCode: string;
};

export interface GetLoungeITF {
  id: string;
  userId: string;
};

export interface GetLoungeMemberListITF {
  loungeId: string;
};

export interface GetLoungeListITF extends GetListITF {
  filter: string;
  loungeUserId: string | null;
};

export interface GetUserListITF {
  loungeId: string;
};

export interface IsMemberITF {
  id: string;
  userId: string;
};

export interface UpdateLoungeInitITF {
  name: string;
  subjectId: string;
  visibility: string;
  description: string;
};

export interface UpdateLoungeITF {
  id: string;
  name: string;
  subjectId: string;
  visibility: string;
  description: string;
  avatar: ImageITF;
  cover: ImageITF;
};

export interface UpdateMemberITF {
  loungeId: string;
  userId: string;
  type: string;
};