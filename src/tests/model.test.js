import React from "react"
import renderer from "react-test-renderer"
import { fetchSchemaPaths, orderSchema } from "../helpers/model"

describe("model", () => {
  it("can render react component", () => {
    // when:
    const component = renderer.create(<div>foo</div>)

    // then:
    expect(component.toJSON()).toMatchSnapshot()
  })

  it("can walk json schema", () => {
    // given:
    const schema = orderSchema

    // when:
    const schemaPaths = fetchSchemaPaths(schema)

    // then:
    expect(schemaPaths).toMatchSnapshot()
  })
})
