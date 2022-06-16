import { Type, Status, Like, Profile, User } from '@prisma/client';

export type HTTPMethod =
  | 'all'
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head';

export interface QuestionBody {
  receiver: string;
  post: string;
  type: Type;
}

export interface AsnwerBody {
  questionId: string;
  post: string;
  status: Status;
}

export interface UserParams {
  name: string;
}

export type UserQuestionQuery = Partial<
  Record<'type' | 'page' | 'itemsPerPage' | 'name', string>
>;

export interface LikeBody {
  questionId: Like['questionId'];
}

export type FindUserParams = Partial<Record<'keyword' | 'preview', string>>;

export type SignUpBody = Partial<Profile & Pick<User, 'password'>>;

export type FollowBody = Partial<Record<'followName', string>>;

export type FollowListQuery = Partial<
  Record<'type' | 'name' | 'startsFrom' | 'take', string>
>;
