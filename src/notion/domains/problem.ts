import { apiCliet } from '../../apis';
import { InvalidMessage } from './invalid';

type StressLevel = 1 | 2 | 3 | undefined;

export type ProblemMessage = {
  type: 'problem';
  content: string;
  stressLevel?: StressLevel;
};

const isValidStressLevel = (n: number | undefined): n is StressLevel =>
  n === undefined || (!Number.isNaN(n) && (n === 1 || n === 2 || n === 3));

const keyWord = 'つらみ';
const invalidMessage: InvalidMessage = {
  type: 'invalid',
  content: '次のフォーマットで投稿してください "つらみ ○○がない (1 | 2 | 3 | [empty])"',
};

const parse = (text: string[]): ProblemMessage | InvalidMessage | undefined => {
  if (text.length < 1 || text[0] !== keyWord) return undefined;
  if (text.length === 1) return invalidMessage;

  const content = text[1];
  const stressLevel = text.length === 2 ? undefined : Number(text[2]);
  if (!isValidStressLevel(stressLevel)) return invalidMessage;
  return {
    type: 'problem',
    content,
    stressLevel,
  };
};

const action = async (message: ProblemMessage) => {
  const result = await apiCliet.postProblem({
    title: message.content,
    stressLevel: message.stressLevel,
  });
  return result.status === 200 ? '投稿が完了しました' : '投稿に失敗しました';
};

export const problemMessageHandler = {
  parse,
  action,
};

export const problemKeyword = keyWord;
