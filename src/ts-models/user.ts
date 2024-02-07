export interface UserInfo {
  username?: string;
  followers?: number;
}

export interface User {
  username: string;
  password: string;
}

export interface UpdatePassword {
  oldPassword: string;
  newPassword: string;
}
