import React, { Fragment } from "react"
import { storiesOf } from "@storybook/react"
import { Box, Heading, ThemeProvider } from "fannypack"
import { UseGridColumnsDemo, UseGridPositionsDemo } from "../helpers/layout"
import { FormDemoOne, FormDemoTwo } from "../helpers/layoutDemo"

const stories = storiesOf("helpers/layout", module)

stories.addDecorator(story => <ThemeProvider>{story()}</ThemeProvider>)

stories.add("useGridColumns()", () => (
  <Playground title="useGridColumns()">
    <UseGridColumnsDemo />
  </Playground>
))

stories.add("useGridPositions()", () => (
  <Playground title="useGridPositions()">
    <UseGridPositionsDemo />
  </Playground>
))

stories.add("form demo: move fieldset", () => (
  <Playground title="form demo: move fieldset">
    <FormDemoOne />
  </Playground>
))

stories.add("form demo: move field within fieldset", () => (
  <Playground title="form demo: move field within fieldset">
    <FormDemoTwo />
  </Playground>
))

export const Playground = ({ title, children }) => {
  return (
    <Box padding="major-5" background="#f7f7f8">
      <Box padding="major-2" background="#ffffff" border="1px solid #cccccc">
        {title && (
          <Heading
            use="h2"
            fontFamily="open sans condensed"
            fontSize="26px"
            color="#121212"
          >
            {title}
          </Heading>
        )}
        {children}
      </Box>
    </Box>
  )
}
