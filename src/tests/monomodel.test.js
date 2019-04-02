import { concat, get, set, pick } from "lodash"
import produce from "immer"
import { schemaWalk } from "@cloudflare/json-schema-walker"
import { object, string, fieldset, field } from "./fixture"

describe("monomodel", () => {
  test("schema 1", () => {
    // given:
    const schema = object({
      title: "order",
    })
    const model = fieldset("object", {
      pointer: "#/",
      title: "order",
    })
    // expect:
    expect(buildModel(schema)).toEqual(model)
  })

  test("schema 2", () => {
    // given:
    const schema = object({
      title: "order",
      properties: {
        orderNumber: string(),
        orderDate: string(),
      },
    })
    const model = fieldset("object", {
      pointer: "#/",
      title: "order",
      children: [
        field("string", {
          pointer: "#/properties/orderNumber",
        }),
        field("string", {
          pointer: "#/properties/orderDate",
        }),
      ],
    })
    // expect:
    expect(buildModel(schema)).toEqual(model)
  })

  test("schema 3", () => {
    // given:
    const schema = object({
      title: "order",
      properties: {
        orderNumber: string(),
        orderDate: string(),
        customer: object({
          properties: {
            customerNumber: string(),
            firstName: string(),
            lastName: string(),
          },
        }),
      },
    })
    const model = fieldset("object", {
      pointer: "#/",
      title: "order",
      children: [
        field("string", {
          pointer: "#/properties/orderNumber",
        }),
        field("string", {
          pointer: "#/properties/orderDate",
        }),
        fieldset("object", {
          pointer: "#/properties/customer",
          children: [
            field("string", {
              pointer: "#/properties/customer/properties/customerNumber",
            }),
            field("string", {
              pointer: "#/properties/customer/properties/firstName",
            }),
            field("string", {
              pointer: "#/properties/customer/properties/lastName",
            }),
          ],
        }),
      ],
    })
    // expect:
    expect(buildModel(schema)).toEqual(model)
  })
})

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
      }
    } else {
      registry[pointer] = {
        parentPointer,
        path,
        index: registry[parentPointer].index,
      }
      registry[parentPointer].index += 1
    }

    const result = []
    let current = registry[pointer]
    result.unshift(current.path ? ["children", current.index] : [])
    while (current.parentPointer) {
      current = registry[current.parentPointer]
      result.unshift(current.path ? ["children", current.index] : [])
    }
    const objectPath = toPath(concat(...result))
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

export const toPath = pathSegments => {
  return pathSegments.join(".")
}

export const toPointer = pathSegments => {
  return `#/${pathSegments.join("/")}`
}
