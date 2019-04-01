import { concat, get, set, pick } from "lodash"
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
  const patches = []
  schemaWalk(schema, (schemaObject, path, parentSchemaObject, parentPath) => {
    const schemaPath = toPath(concat(parentPath, path))
    const pointer = toPointer(concat(parentPath, path))
    const type = schemaObject.type
    if (type === "object" || type === "array") {
      const payload = pick(schemaObject, ["title"])
      const node = fieldset(type, { pointer, ...payload })
      const _path = schemaPath ? "root." + schemaPath : "root"
      patches.push({ path: _path, node })
    } else {
      const payload = pick(schemaObject, ["title"])
      const node = field(type, { pointer, ...payload })
      const _path = "root." + schemaPath.replace("properties.", "children.")
      patches.push({ path: _path, node })
    }
  })
  const model = {}
  patches.forEach(patch => {
    set(model, patch.path || "root", patch.node)
  })
  return model.root
}

export const toPath = pathSegments => {
  return pathSegments.join(".")
}

export const toPointer = pathSegments => {
  return `#/${pathSegments.join("/")}`
}
