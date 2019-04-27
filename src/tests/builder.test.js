import {
  buildModel,
  buildFlatModel,
  toPointer,
  toObjectPath,
} from "../helpers/builder"
import {
  object,
  array,
  string,
  number,
  integer,
  fieldset,
  field,
} from "../helpers/model"
import { pretty1 } from "../helpers/utils"

describe("flat builder", () => {
  test("schema 1", () => {
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

  test("schema 3", () => {
    // given:
    const schema = object({
      title: "order",
      properties: {
        orderNumber: string(),
        orderDate: string(),
        customer: object({
          title: "customer",
          properties: {
            customerNumber: string(),
            firstName: string(),
            lastName: string(),
          },
        }),
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
        fieldset("object", {
          pointer: "#/properties/customer",
          title: "customer",
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
    expect(buildFlatModel(schema)).toEqual(model)
  })

  test("schema 4", () => {
    // given:
    const schema = object({
      title: "order",
      properties: {
        orderNumber: string(),
        orderDate: string(),
        customer: object({
          title: "customer",
          properties: {
            customerNumber: string(),
            firstName: string(),
            lastName: string(),
          },
        }),
        orderItems: array({
          title: "items",
          items: object({
            title: "item",
            properties: {
              productNumber: string(),
              quantity: integer(),
              unitPrice: integer(),
            },
          }),
        }),
        totalPrice: number(),
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
        fieldset("object", {
          pointer: "#/properties/customer",
          title: "customer",
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
          title: "items",
        }),
        fieldset("object", {
          pointer: "#/properties/orderItems/items",
          title: "item",
          children: [
            field("string", {
              pointer: "#/properties/orderItems/items/properties/productNumber",
            }),
            field("integer", {
              pointer: "#/properties/orderItems/items/properties/quantity",
            }),
            field("integer", {
              pointer: "#/properties/orderItems/items/properties/unitPrice",
            }),
          ],
        }),
        fieldset("object", {
          pointer: "#/",
          title: "order",
          children: [
            field("number", {
              pointer: "#/properties/totalPrice",
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
          title: "customer",
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
          title: "customer",
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
          title: "customer",
          properties: {
            customerNumber: string(),
            firstName: string(),
            lastName: string(),
          },
        }),
        orderItems: array({
          title: "items",
          items: object({
            title: "item",
            properties: {
              productNumber: string(),
              quantity: integer(),
              unitPrice: integer(),
            },
          }),
        }),
        totalPrice: number(),
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
          title: "customer",
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
          title: "items",
          children: [
            fieldset("object", {
              pointer: "#/properties/orderItems/items",
              title: "item",
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
        field("number", {
          pointer: "#/properties/totalPrice",
        }),
      ],
    })
    // expect:
    expect(buildModel(schema)).toEqual(model)
  })
})
