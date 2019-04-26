import { get, set, pick, concat } from "lodash"
import { schemaWalk } from "@cloudflare/json-schema-walker"
import { fieldset, field } from "./model"
import { pretty1 } from "./utils"

/**
 * Builds a flat model using a json schema.
 */
export const buildFlatModel = schema => {
  const registry = {
    fieldsetIndex: -1,
    fieldIndex: -1,
    currentParentPointer: null,
  }
  const model = fieldset("array")
  traverseSchema(schema, (object, parentObject) => {
    const pointer = toPointer(concat(parentObject.path, object.path))
    const parentPointer = toPointer(parentObject.path)
    const type = object.schema.type

    if (!isFieldsetType(type) && parentPointer !== registry.currentParentPointer) {
      registry.fieldsetIndex += 1
      registry.fieldIndex = -1
      registry.currentParentPointer = parentPointer

      const objectPathSegments = []
      objectPathSegments.push(`children[${registry.fieldsetIndex}]`)
      const objectPath = toObjectPath(concat(...objectPathSegments))
      // console.log(pretty1([objectPath, parentPointer]))

      const payload = pick(parentObject.schema, ["title"])
      const node = fieldset(parentObject.schema.type, { pointer: parentPointer, ...payload })
      set(model, objectPath, node)
    }

    if (isFieldsetType(type)) {
      registry.fieldsetIndex += 1
      registry.fieldIndex = -1
      registry.currentParentPointer = pointer
    } else {
      registry.fieldIndex += 1
    }

    const objectPathSegments = []
    objectPathSegments.push(`children[${registry.fieldsetIndex}]`)
    if (!isFieldsetType(type)) {
      objectPathSegments.push(`children[${registry.fieldIndex}]`)
    }
    const objectPath = toObjectPath(concat(...objectPathSegments))
    // console.log(pretty1([objectPath, pointer]))

    if (isFieldsetType(type)) {
      const payload = pick(object.schema, ["title"])
      const node = fieldset(type, { pointer, ...payload })
      set(model, objectPath, node)
    } else {
      const payload = pick(object.schema, ["title"])
      const node = field(type, { pointer, ...payload })
      set(model, objectPath, node)
    }
  })
  return model
}

/**
 * Builds a nested model using a json schema.
 */
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
    const objectPath = toObjectPath(concat(...objectPathSegments))
    const rootObjectPath = objectPath ? "root." + objectPath : "root"
    // console.log(pretty1([objectPath, pointer]))

    if (isFieldsetType(type)) {
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

export const isFieldsetType = type => {
  return type === "object" || type === "array"
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
