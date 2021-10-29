import { ApiResponse } from "apisauce"
import { saveString } from "../../utils/storage"
import { Api } from "./api"
import { getGeneralApiProblem } from "./api-problem"
import { TransactionsResult, TransactionResult } from "./api.types"

export class TransactionApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async transactionDetail(id: string): Promise<TransactionResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get("/Transaction/detail", {
        id,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok", ...JSON.parse(response.data) }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async newPurchase(data: any): Promise<TransactionResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post("/Transaction/new", {
        ...data,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      const { transactions } = response.data

      return { kind: "ok", transaction: { ...transactions } }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async newIncome(data: any): Promise<TransactionResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post("/Transaction/new", {
        ...data,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      const { transactions } = response.data

      return { kind: "ok", transaction: { ...transactions } }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async transactionsFiltered(userName: string, date: Date): Promise<TransactionsResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post("/Transaction/filtered", {
        userName,
        date,
      })
      const { transactions } = response.data
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      console.log(transactions)
      return { kind: "ok", transactions: transactions }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async transactionUpdate(id: number, state: string): Promise<TransactionsResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post("/Transaction/update", {
        id,
        state,
      })
      const { transactions } = response.data
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      console.log(transactions)
      return { kind: "ok", transactions: transactions }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async transactionsPending(): Promise<TransactionsResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post("/Transaction/pending")
      const { transactions } = response.data
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      console.log(transactions)
      return { kind: "ok", transactions: transactions }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
