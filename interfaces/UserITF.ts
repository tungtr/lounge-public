// Interfaces
import { ImageITF } from '@interfaces/ImageITF';

export interface UserITF {
  _id: string;
  _v: number;
  email: string;
  username: string;
  avatar: ImageITF;
  createdAt: Date;
  updatedAt: Date;
};

export interface GetUserITF {
  email: string;
};

export interface GetLoungeUserITF {
  loungeTrigger: boolean;
};

export interface ChangePasswordITF {
  old: string;
  password: string;
  confirm: string;
};

export interface UpdateProfileInitITF {
  email: string;
  username: string;
};

export interface UpdateProfileITF {
  avatar: ImageITF;
  email: string;
  username: string;
}