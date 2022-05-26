import { QuestionStatus, QuestionType } from "../types";

export interface Question {
    id: number; // 고유번호
    type: QuestionType; // 질문 유형 (익명, 실명)
    status: QuestionStatus; // 질문 상태 (답변안됨, 거절, 답변완료)
    author?: number; // 질문 작성 이
    receiver: number; // 질문 받는 이
    question: string; // 질문 내용
    answer: string; // 답변 내용
}