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
export type FollowListQuery = Query<'type' | 'name' | 'startsFrom' | 'take'>;
export type FollowBody = Query<'followName'>;

export type QuestionList = {
  id: string;
  createAt: Date;
  type: Type;
  question: string;
  answer: string;
  receiver: {
    userName: string;
    image: string;
    name: string;
  };
  likeCount: number;
  liked?: boolean;
}[];

export type FollowingFeed = {
  follower: {
    userName: string;
    received: {
      id: string;
      createAt: Date;
      answerAt: Date;
      type: Type;
      question: string;
      answer: string;
      authorName: string;
      likeCount: number;
      liked?: boolean;
    }[];
    email: string;
    name: string;
    image: string;
  };
}[];

export type RandomFeed = {
  id: string;
  createAt: Date;
  question: string;
  answer: string;
  authorName: string;
  likeCount: number;
  liked?: boolean;
  receiver: {
    userName: string;
    name: string;
    image: string;
  };
}[];

export type Notification = Query<'type'>;
export type NotificationDelete = Query<'id'>;
export type NotificationChange = Query<'id' | 'read'>;
