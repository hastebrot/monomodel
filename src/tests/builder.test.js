import {
  buildModel,
  buildFlatModel,
  toPointer,
  toObjectPath,
} from "../library/builder"
import {
  object,
  array,
  string,
  integer,
  fieldset,
  field,
} from "../library/model"
import { pretty1 } from "../library/utils"

describe("flat builder", () => {
  test.only("schema 1", () => {
    // given:
    const schema = object({
      title: "order",
    })
    const model = fieldset("array", {
      children: [
        fieldset("object", {
          pointer: "#/",
          title: "order",
        }),
      ],
    })
    // expect:
    expect(buildFlatModel(schema)).toEqual(model)
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
    const model = fieldset("array", {
      children: [
        fieldset("object", {
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
        }),
      ],
    })

    // expect:
    expect(buildFlatModel(schema)).toEqual(model)
  })
})

describe("builder", () => {
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

  test("schema 4", () => {
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
        orderItems: array({
          items: object({
            properties: {
              productNumber: string(),
              quantity: integer(),
              unitPrice: integer(),
            },
          }),
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
        fieldset("array", {
          pointer: "#/properties/orderItems",
          children: [
            fieldset("object", {
              pointer: "#/properties/orderItems/items",
              children: [
                field("string", {
                  pointer:
                    "#/properties/orderItems/items/properties/productNumber",
                }),
                field("integer", {
                  pointer: "#/properties/orderItems/items/properties/quantity",
                }),
                field("integer", {
                  pointer: "#/properties/orderItems/items/properties/unitPrice",
                }),
              ],
            }),
          ],
        }),
      ],
    })
    // expect:
    expect(buildModel(schema)).toEqual(model)
  })
})
