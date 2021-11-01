// This is the first file that ReactNative will run when it starts up.
import App from "./app/app.tsx"
import { registerRootComponent } from "expo"
import { createServer, Model } from "miragejs"
import {LogBox } from 'react-native';

LogBox.ignoreLogs(['Reanimated 2', "Unable to symbolicate", 'Setting a timer']);

if (window.server) {
  server.shutdown()
}

window.server = createServer({
  models: {
    users: Model,
    transactions: Model,
  },
  seeds(server) {
    server.schema.users.create({
      userName: "alegentil",
      emailAddress: "vyseclown@gmail.com",
      password: "123456",
    })
    server.schema.users.create({
      userName: "adm",
      emailAddress: "adm@gmail.com",
      password: "12345678",
      admin: "true"
    })
    server.schema.transactions.create({
      // id: "3",
      value: "3200",
      date: "2021-10-24T23:42:22.200Z",
      type: "expense",
      description: "t-shirt",
      userName: "alegentil",
      emailAddress: "vyseclown@gmail.com",
      idUser: "1",
      state: "approved",
    })
    server.schema.transactions.create({
      // id: "4",
      value: "3300",
      date: "2021-10-26T23:42:22.200Z",
      type: "expense",
      description: "t-shirt",
      userName: "alegentil",
      emailAddress: "vyseclown@gmail.com",
      idUser: "1",
      state: "approved",
    })
    server.schema.transactions.create({
      // id: "5",
      value: "15000",
      date: "2021-10-13T23:42:22.200Z",
      type: "income",
      incomeType: "check",
      description: "salary",
      userName: "alegentil",
      emailAddress: "vyseclown@gmail.com",
      idUser: "1",
      state: "approved",
    })
    server.schema.transactions.create({
      // id: "5",
      value: "1500",
      date: "2021-10-13T23:42:22.200Z",
      type: "income",
      incomeType: "check",
      description: "FII",
      userName: "alegentil",
      emailAddress: "vyseclown@gmail.com",
      idUser: "1",
      state: "pending",
    })
  },
  routes() {
    this.post("/api/Authentication/log-in", (schema, request) => {
      const attrs = JSON.parse(request.requestBody)
      const { emailAddress, password } = attrs
      const user = schema.users.findBy({ emailAddress, password })
      const { id, userName, emailAddress: email } = user
      if (!user) {
        throw new Error("Invalid credentials")
      }
      return {
        user: { id: id, userName: userName, emailAddress: email, admin: user?.admin },
        kind: "ok",
      }
    })

    this.get("/api/Authentication/get", (schema, request) => {
      const attrs = JSON.parse(request.requestBody)
      const { emailAddress } = attrs
      const user = schema.users.findBy({ emailAddress })

      return {
        ...user,
        kind: "ok",
      }
    })

    this.post("/api/Authentication/sign-up", (schema, request) => {
      const attrs = JSON.parse(request.requestBody)
      const { emailAddress, userName } = attrs

      if (schema.users.where({ emailAddress }).models.length > 0) {
        throw new Error("Email already exists")
      }
      if (schema.users.where({ userName }).models.length > 0) {
        throw new Error("User already exists")
      }
      return schema.users.create(attrs)
    })

    this.post("/api/Transaction/filtered", (schema, request) => {
      const attrs = JSON.parse(request.requestBody)
      const { userName } = attrs
      const { models: transactions } = schema.transactions.where(
        (transaction) => transaction.userName === userName
      )
      if (!transactions) {
        throw new Error("No transactions found")
      }
      return {
        transactions: transactions,
        kind: "ok",
      }
    })

    this.post("/api/Transaction/pending", (schema, request) => {
      const { models: transactions } = schema.transactions.where(
        (transaction) => transaction.state === "pending"
      )
      if (!transactions) {
        throw new Error("No transactions found")
      }

      return {
        transactions: transactions,
        kind: "ok",
      }
    })

    this.get("/api/Transaction/detail", (schema, request) => {
      const attrs = JSON.parse(request.requestBody)
      const { id } = attrs
      const transaction = schema.transactions.findBy({ id })
      if (!transaction) {
        throw new Error("No transaction found")
      }

      return {
        ...transaction,
        kind: "ok",
      }
    })

    this.post("/api/Transaction/update", (schema, request) => {
      const attrs = JSON.parse(request.requestBody)
      const { id, state } = attrs
      const transaction = schema.transactions.findBy({ id })
      if (!transaction) {
        throw new Error("No transaction found")
      }
      transaction.update({ state: state })
      return {
        ...transaction,
        kind: "ok",
      }
    })

    this.post("/api/Transaction/new", (schema, request) => {
      const attrs = JSON.parse(request.requestBody)
      return schema.transactions.create(attrs)
    })
  },
})
registerRootComponent(App)
export default App
