export interface User {
  username: string;
  password: string;
}

export interface UserInfo {
  username: string;
  followers: { username: string }[];
}
export interface LoginResponse {
  user: UserInfo;
  token: string;
}

export interface UpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export interface Response {
  username: string;
  followers: number;
}
