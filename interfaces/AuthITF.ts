export interface AuthModalDataITF {
  id: number;
  title: string;
};

export interface LoginITF {
  email: string;
  password: string;
}

export interface SignUpITF {
  email: string;
  username: string;
  password: string;
}

export interface ResetPasswordITF {
  password: string;
  confirm: string;
}

export interface UserITF {
  _id: string;
  email: string;
  username: string;
}