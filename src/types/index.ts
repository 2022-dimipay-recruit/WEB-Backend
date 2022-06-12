import { Type, Status } from '@prisma/client';

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
