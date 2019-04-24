import { concat, get, set, pick } from "lodash"
import { schemaWalk } from "@cloudflare/json-schema-walker"
import { object, array, string, integer, fieldset, field } from "./fixture"
import { pretty1 } from "../utils"

export const buildModel = schema => {
  const registry = {}
  const model = {}
  schemaWalk(schema, (schemaObject, path, parentSchemaObject, parentPath) => {
    const pointer = toPointer(concat(parentPath, path))
    const parentPointer = toPointer(parentPath)
    const type = schemaObject.type

    if (pointer === parentPointer) {
      registry[pointer] = {
        parentPointer: null,
        path: null,
        index: 0,
        nextChildIndex: 0,
      }
    } else {
      registry[pointer] = {
        parentPointer,
        path,
        index: registry[parentPointer].nextChildIndex,
        nextChildIndex: 0,
      }
      registry[parentPointer].nextChildIndex += 1
    }

    const rewritePathSegment = ({ path, index }) => {
      // return path || []
      return path ? ["children", index] : []
    }

    const objectPathSegments = []
    let currentEntry = registry[pointer]
    while (currentEntry) {
      objectPathSegments.unshift(rewritePathSegment(currentEntry))
      currentEntry = registry[currentEntry.parentPointer]
    }

    // console.log(pretty1([parentPath, path]))
    // console.log(pretty1(objectPathSegments))

    const objectPath = toObjectPath(concat(...objectPathSegments))
    const rootObjectPath = objectPath ? "root." + objectPath : "root"

    if (type === "object" || type === "array") {
      const payload = pick(schemaObject, ["title"])
      const node = fieldset(type, { pointer, ...payload })
      set(model, rootObjectPath, node)
    } else {
      const payload = pick(schemaObject, ["title"])
      const node = field(type, { pointer, ...payload })
      set(model, rootObjectPath, node)
    }
  })
  return model.root
}

export const toPointer = pathSegments => {
  return `#/${pathSegments.join("/")}`
}

export const toObjectPath = pathSegments => {
  return pathSegments.join(".")
}
