import React, { Fragment } from "react"
import { storiesOf } from "@storybook/react"
import { Box, ThemeProvider } from "fannypack"
import FormEditor from "../components/FormEditor"
import SchemaEditor from "../components/SchemaEditor"

const stories = storiesOf("components/editor", module)

stories.addDecorator(story => (
  <ThemeProvider>
    <Box padding="major-6" background="#f7f7f8">
      {story()}
    </Box>
  </ThemeProvider>
))

stories.add("form editor", () => (
  <Box padding="0" background="#ffffff" border="1px solid #cccccc">
    <FormEditor />
  </Box>
))

stories.add("schema editor", () => (
  <Box padding="major-3" background="#ffffff" border="1px solid #cccccc">
    <SchemaEditor />
  </Box>
))
