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
}

export type Query<T extends string> = Partial<Record<T, string>>;

export interface UserParams {
  name: string;
}

export type UserQuestionQuery = Query<
  'type' | 'page' | 'itemsPerPage' | 'name'
>;

export type SignUpBody = Partial<Profile & Pick<User, 'password'>>;
export type LikeBody = Query<'questionId'>;
export type FindUserParams = Query<'keyword' | 'preview'>;
export type DeleteQuestion = LikeBody;
export type RejectQuestion = LikeBody;
export type FollowListQuery = Query<'type' | 'name' | 'startsFrom' | 'take'>
export type FollowBody = Query<'followName'>
export type FindUserParams = Query<'keyword' | 'preview'>
