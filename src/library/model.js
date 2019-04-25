import { schemaWalk } from "@cloudflare/json-schema-walker"
import { concat } from "lodash"

export const buildDefinition = (type, payload) => {
  return { type, ...payload }
}

export const object = payload => buildDefinition("object", payload)
export const array = payload => buildDefinition("array", payload)
export const boolean = payload => buildDefinition("boolean", payload)
export const string = payload => buildDefinition("string", payload)
export const number = payload => buildDefinition("number", payload)
export const integer = payload => buildDefinition("integer", payload)

export const fieldset = (datatype, payload = {}) =>
  buildDefinition("fieldset", { datatype, ...payload })
export const field = (datatype, payload = {}) =>
  buildDefinition("field", { datatype, ...payload })

export const taskSchema = object({
  title: "A list of tasks",
  required: ["title"],
  properties: {
    title: string({
      title: "Task list title",
    }),
    tasks: array({
      title: "Tasks",
      items: object({
        required: ["title"],
        properties: {
          title: string({
            title: "Title",
            description: "A sample title",
          }),
          details: string({
            title: "Task details",
            description: "Enter the task details",
          }),
          done: boolean({
            title: "Done?",
            default: false,
          }),
        },
      }),
    }),
  },
})

export const taskModel = fieldset("object", {
  pointer: "#/",
  title: "A list of tasks",
  children: [
    field("string", {
      pointer: "#/properties/title",
      name: "title",
      title: "Task list title",
    }),
    fieldset("array", {
      pointer: "#/properties/tasks",
      name: "tasks",
      title: "Tasks",
      children: [
        fieldset("object", {
          pointer: "#/properties/tasks/items",
          name: "items",
          children: [
            field("string", {
              pointer: "#/properties/tasks/items/properties/title",
              name: "title",
              title: "Title",
              description: "A sample title",
            }),
            field("string", {
              pointer: "#/properties/tasks/items/properties/details",
              name: "details",
              title: "Task details",
              description: "Enter the task details",
            }),
            field("boolean", {
              pointer: "#/properties/tasks/items/properties/done",
              name: "done",
              title: "Done?",
              default: false,
            }),
          ],
        }),
      ],
    }),
  ],
})

export const orderSchema = object({
  $schema: "http://json-schema.org/schema#",
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
    orderItems: array({
      items: object({
        properties: {
          productNumber: string(),
          quantity: integer(),
          unitPrice: integer(),
        },
      }),
    }),
    shippingAddress: object({
      properties: {
        street: string(),
        city: string(),
        country: string(),
        zip: string(),
      },
    }),
    totalPrice: number(),
  },
})

export const fetchSchemaPaths = schema => {
  const schemaPaths = []
  schemaWalk(schema, (schemaObject, path, parentSchemaObject, parentPath) => {
    schemaPaths.push({
      type: schemaObject.type,
      path,
      parentPath,
      fullPath: concat(parentPath, path),
    })
  })
  return schemaPaths
}
