import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { LoginResult, LogoutResult, RegisterResult } from "../../services/api"
import { AuthenticationApi } from "../../services/api/authentication-api"
import { saveString, clear } from "../../utils/storage"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-status"

/**
 * Model description here for TypeScript hints.
 */
export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    isAuthenticationed: types.optional(types.boolean, false),
    isAdmin: types.optional(types.boolean, false),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .actions((self) => ({
    setAuthenticated(value: boolean) {
      self.isAuthenticationed = value
    },
    setIsAdmin(value: boolean) {
      self.isAdmin = value
    }
  }))
  .actions((self) => ({
    login: flow(function* (emailAddress: string, password: string, setUser: (user: any) => void, hasRequestError?: () => void) {
      self.setStatus("pending")

      const authenticationApi = new AuthenticationApi(self.environment.api)
      const result: LoginResult = yield authenticationApi.login(emailAddress, password)
      if (result.kind === "ok") {
        setUser(result.user)
        saveString("id", result.user.id.toString())
        saveString("userName", result.user.userName)
        result?.user?.admin ? self.setIsAdmin(true) : self.setIsAdmin(false)
        self.setStatus("done")
        self.setAuthenticated(true)
      } else {
        self.setStatus("error")
        self.setAuthenticated(false)
        hasRequestError && hasRequestError()
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    logout: flow(function* () {
      self.setStatus("pending")

      const authenticationApi = new AuthenticationApi(self.environment.api)
      const result: LogoutResult = yield authenticationApi.logout()

      if (result.kind === "ok") {
        self.setStatus("done")
        clear()
        self.setAuthenticated(false)
      } else {
        self.setStatus("error")
        self.setAuthenticated(false)
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    register: flow(function* (emailAddress: string, password: string, userName: string) {
      self.setStatus("pending")

      const authenticationApi = new AuthenticationApi(self.environment.api)
      const result: RegisterResult = yield authenticationApi.register(emailAddress, password, userName)

      if (result.kind === "ok") {
        self.setStatus("done")
      } else {
        self.setStatus("error")
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))

type AuthenticationStoreType = Instance<typeof AuthenticationStoreModel>
export interface AuthenticationStore extends AuthenticationStoreType {}
type AuthenticationStoreSnapshotType = SnapshotOut<typeof AuthenticationStoreModel>
export interface AuthenticationStoreSnapshot extends AuthenticationStoreSnapshotType {}
export const createAuthenticationStoreDefaultModel = () =>
  types.optional(AuthenticationStoreModel, {})
