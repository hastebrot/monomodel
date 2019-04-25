import { concat, get, set, pick } from "lodash"
import { schemaWalk } from "@cloudflare/json-schema-walker"
import { object, array, string, integer, fieldset, field } from "./model"
import { pretty1 } from "./utils"

export const buildFlatModel = schema => {
  const model = {}
  traverseSchema(schema, (object, parentObject) => {
    const pointer = toPointer(concat(parentObject.path, object.path))
    const parentPointer = toPointer(parentObject.path)
    const type = object.schema.type

    if (isRootPointer(pointer, parentPointer)) {
      console.log(object.schema)
    }
  })
  return model
}

export const buildModel = schema => {
  const registry = {}
  const model = {}
  traverseSchema(schema, (object, parentObject) => {
    const pointer = toPointer(concat(parentObject.path, object.path))
    const parentPointer = toPointer(parentObject.path)
    const type = object.schema.type

    if (isRootPointer(pointer, parentPointer)) {
      registry[pointer] = {
        parentPointer: null,
        path: null,
        index: 0,
        nextChildIndex: 0,
      }
    } else {
      registry[pointer] = {
        parentPointer,
        path: object.path,
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

    // console.log(pretty1([parentObject.path, object.path]))
    // console.log(pretty1(objectPathSegments))

    const objectPath = toObjectPath(concat(...objectPathSegments))
    const rootObjectPath = objectPath ? "root." + objectPath : "root"

    if (type === "object" || type === "array") {
      const payload = pick(object.schema, ["title"])
      const node = fieldset(type, { pointer, ...payload })
      set(model, rootObjectPath, node)
    } else {
      const payload = pick(object.schema, ["title"])
      const node = field(type, { pointer, ...payload })
      set(model, rootObjectPath, node)
    }
  })
  return model.root
}

export const isRootPointer = (pointer, parentPointer) => {
  return pointer === parentPointer
}

export const toPointer = pathSegments => {
  return `#/${pathSegments.join("/")}`
}

export const toObjectPath = pathSegments => {
  return pathSegments.join(".")
}

export const traverseSchema = (schema, visitFn) => {
  schemaWalk(schema, (schemaObject, path, parentSchemaObject, parentPath) => {
    const object = { schema: schemaObject, path: path }
    const parentObject = { schema: parentSchemaObject, path: parentPath }
    visitFn(object, parentObject)
  })
}
