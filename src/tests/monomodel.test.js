import { schema, fetchSchemaPaths } from "./fixture"

describe("monomodel", () => {
  test("schema", () => {
    console.log("schema", schema)
    console.log("schema paths", fetchSchemaPaths(schema))
  })
})
