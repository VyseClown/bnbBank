import { Instance, SnapshotOut, types } from "mobx-state-tree"



export const TransactionModel = types.model("Transaction").props({
  id: types.identifierNumber,
  date: types.maybe(types.string),
  value: types.maybe(types.string),
  type: types.maybe(types.string),
  description: types.maybe(types.string),
  userName: types.maybe(types.string),
  idUser: types.maybe(types.string),
  state: types.enumeration("State", ["pending", "approved", "rejected"]),
  checkImageURI: types.maybe(types.string),
})

type TransactionType = Instance<typeof TransactionModel>
export interface Transaction extends TransactionType {}
type TransactionSnapshotType = SnapshotOut<typeof TransactionModel>
export interface TransactionSnapshot extends TransactionSnapshotType {}
export const createTransactionDefaultModel = () => types.optional(TransactionModel, {})