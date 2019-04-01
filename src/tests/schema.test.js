import React from "react"
import renderer from "react-test-renderer"
import { fetchSchemaPaths } from "./fixture"

describe("schema", () => {
  it("can render react component", () => {
    // when:
    const component = renderer.create(<div>foo</div>)

    // then:
    expect(component.toJSON()).toMatchSnapshot()
  })

  it("can walk json schema", () => {
    // given:
    const schema = {
      $schema: "http://json-schema.org/schema#",
      type: "object",
      properties: {
        orderNumber: { type: "string" },
        orderDate: { type: "string" },
        customer: {
          type: "object",
          properties: {
            customerNumber: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
          },
        },
        orderItems: {
          type: "array",
          items: {
            type: "object",
            properties: {
              // #/properties/orderItems/items/properties/productNumber/type
              productNumber: { type: "string" },
              quantity: { type: "integer" },
              unitPrice: { type: "integer" },
            },
          },
        },
        shippingAddress: {
          type: "object",
          properties: {
            street: { type: "string" },
            city: { type: "string" },
            country: { type: "string" },
            zip: { type: "string" },
          },
        },
        totalPrice: { type: "number" },
      },
    }

    // when:
    const schemaPaths = fetchSchemaPaths(schema)

    // then:
    expect(schemaPaths).toMatchSnapshot()
  })
})
