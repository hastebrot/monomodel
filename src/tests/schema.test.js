import React from "react"
import renderer from "react-test-renderer"
import { fetchSchemaPaths, orderSchema } from "./fixture"

describe("schema", () => {
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
