import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { TransactionResult, TransactionsResult } from "../../services/api"
import { TransactionApi } from "../../services/api/transaction-api"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-status"
import { Transaction } from "../transaction/transaction"

/**
 * Model description here for TypeScript hints.
 */
export const TransactionStoreModel = types
  .model("TransactionStore")
  .extend(withEnvironment)
  .extend(withStatus)
  .actions((self) => ({
    transactionDetail: flow(function* (id: string) {
      self.setStatus("pending")

      const transactionApi = new TransactionApi(self.environment.api)
      const result: TransactionResult = yield transactionApi.transactionDetail(id)

      if (result.kind === "ok") {
        self.setStatus("done")
      } else {
        self.setStatus("error")
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    newPurchase: flow(function* (transaction: Transaction) {
      self.setStatus("pending")

      const transactionApi = new TransactionApi(self.environment.api)
      const result: TransactionResult = yield transactionApi.newPurchase(transaction)
      if (result.kind === "ok") {
        self.setStatus("done")
        return { ...result.transaction }
      } else {
        self.setStatus("error")
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    transactionsFiltered: flow(function* (userName: string, date: Date) {
      self.setStatus("pending")

      const transactionApi = new TransactionApi(self.environment.api)
      const result: TransactionsResult = yield transactionApi.transactionsFiltered(userName, date)
      if (result.kind === "ok") {
        self.setStatus("done")
        return result.transactions
      } else {
        self.setStatus("error")
        __DEV__ && console.tron.log(result.kind)
        return []
      }
    }),

    transactionUpdate: flow(function* (id: number, state: string) {
      self.setStatus("pending")

      const transactionApi = new TransactionApi(self.environment.api)
      const result: TransactionResult = yield transactionApi.transactionUpdate(id, state)
      if (result.kind === "ok") {
        self.setStatus("done")
        return result.transaction
      } else {
        self.setStatus("error")
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    transactionsPending: flow(function* () {
      self.setStatus("pending")

      const transactionApi = new TransactionApi(self.environment.api)
      const result: TransactionsResult = yield transactionApi.transactionsPending()
      if (result.kind === "ok") {
        self.setStatus("done")
        return result.transactions
      } else {
        self.setStatus("error")
        __DEV__ && console.tron.log(result.kind)
        return []
      }
    }),
  }))

type TransactionStoreType = Instance<typeof TransactionStoreModel>
export interface TransactionStore extends TransactionStoreType {}
type TransactionStoreSnapshotType = SnapshotOut<typeof TransactionStoreModel>
export interface AuthenticationStoreSnapshot extends TransactionStoreSnapshotType {}
export const createTransactionStoreDefaultModel = () => types.optional(TransactionStoreModel, {})
