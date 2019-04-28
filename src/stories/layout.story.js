import React, { Fragment } from "react"
import { storiesOf } from "@storybook/react"
import { Box, ThemeProvider } from "fannypack"
import { UseGridColumnsDemo, UseGridPositionsDemo } from "../helpers/layout"

const stories = storiesOf("helpers/layout", module)

stories.addDecorator(story => (
  <ThemeProvider>
    <Box padding="major-6" background="#f7f7f8">
      {story()}
    </Box>
  </ThemeProvider>
))

stories.add("useGridColumns", () => (
  <Box padding="major-2" background="#ffffff" border="1px solid #cccccc">
    <UseGridColumnsDemo />
  </Box>
))

stories.add("useGridPositions", () => (
  <Box padding="major-2" background="#ffffff" border="1px solid #cccccc">
    <UseGridPositionsDemo />
  </Box>
))
