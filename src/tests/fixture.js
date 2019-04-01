import { schemaWalk } from "@cloudflare/json-schema-walker"
import { concat } from "lodash"

export const buildDefinition = (type, payload) => {
  return { type, ...payload }
}
export const object = payload => buildDefinition("object", payload)
export const array = payload => buildDefinition("array", payload)
export const string = payload => buildDefinition("string", payload)
export const number = payload => buildDefinition("number", payload)
export const boolean = payload => buildDefinition("boolean", payload)

export const schema = object({
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
