import { taskSchema, fetchSchemaPaths } from "./fixture"

describe("monomodel", () => {
  test("schema", () => {
    console.log("schema", taskSchema)
    console.log("schema paths", fetchSchemaPaths(taskSchema))
  })
})
