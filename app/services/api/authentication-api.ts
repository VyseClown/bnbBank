import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { getGeneralApiProblem } from "./api-problem"
import { LoginResult, LogoutResult } from "./api.types"

export class AuthenticationApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async login(emailAddress: string, password: string): Promise<LoginResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post("/Authentication/log-in", {
        emailAddress,
        password,
      })
      const {user} = response.data
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", user }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async register(emailAddress: string, password: string, userName: string): Promise<LoginResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post("/Authentication/sign-up", {
        emailAddress,
        password,
        userName,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok" }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async logout(): Promise<LogoutResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.patch(
        "/api/Authentication/log-out",
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok" }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
