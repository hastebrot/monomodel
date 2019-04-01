import { schemaWalk } from "@cloudflare/json-schema-walker"
import { taskSchema, taskModel } from "./fixture"
import { pretty } from "../utils"
import { concat, get, set } from "lodash"
import { Object } from "es6-shim"

describe("monomodel", () => {
  test("schema", () => {
    console.log("schema", pretty(taskSchema))
    console.log("model", pretty(taskModel))
    console.log("inspected model", pretty(inspectModel(taskSchema)))
  })
})

export const inspectModel = schema => {
  const model = {}
  schemaWalk(schema, (schemaObject, path, parentSchemaObject, parentPath) => {
    const fullPath = toPath(concat(parentPath, path))
    model[fullPath] = {
      type: schemaObject.type,
      keys: Object.keys(schemaObject),
      pointer: toPointer(concat(parentPath, path)),
    }
  })
  return model
}

export const toPath = pathSegments => {
  return pathSegments.join(".")
}
export const toPointer = pathSegments => {
  return `#/${pathSegments.join("/")}`
}
