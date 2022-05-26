export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  salt: string;
  profile: string;
}

export interface Account {
  username: string;
  password: string;
}

export interface UserIdentity {
  id: number;
  username: string;
  email: string;
  name: string;
  profile: string;
}