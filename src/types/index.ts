import { Type, Status, Like } from '@prisma/client';

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
  Record<'type' | 'page' | 'itemsPerPage', string>
>;

export interface LikeBody {
  questionId: Like['questionId'];
}
