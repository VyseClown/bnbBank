import { GeneralApiProblem } from "./api-problem"
import { Transaction} from '../../models/transaction/transaction'

export interface User {
  id: number
  userName: string
  admin: string
}

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem

export type LoginResult = { kind: "ok", user:User } | GeneralApiProblem;
export type LogoutResult = { kind: "ok" } | GeneralApiProblem;
export type RegisterResult = { kind: "ok" } | GeneralApiProblem;

export type TransactionsResult = { kind: "ok"; transactions: Transaction[] } | GeneralApiProblem;
export type TransactionResult = { kind: "ok"; transaction: Transaction } | GeneralApiProblem;