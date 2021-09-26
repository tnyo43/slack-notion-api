import { ProblemParams, problemsApiClient } from "./domains/problems";

export namespace Params {
  export type FetchProblem = ProblemParams.FetchProblems;
  export type PostProblem = ProblemParams.PostProblem;
}

export const apiCliet = {
  ...problemsApiClient,
};
