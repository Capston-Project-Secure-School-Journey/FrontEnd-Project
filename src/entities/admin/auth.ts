export interface AdminLoginEntity {
  username: string;
  password: string;
}

export interface ResponseAuthEntity {
  id?: string;
  userName?: string;
  accountStatus?: number;
  userType?: number;
  token?: string;
}
