import React, { Fragment } from "react"
import { storiesOf } from "@storybook/react"
import { Box, ThemeProvider } from "fannypack"
import EditorForm from "../components/EditorForm"
import EditorJsonSchema from "../components/EditorJsonSchema"

const stories = storiesOf("Components/Index", module)

stories.addDecorator(story => (
  <ThemeProvider>
    <Box padding="major-6" background="#f7f7f8">
      {story()}
    </Box>
  </ThemeProvider>
))

stories.add("form editor", () => (
  <Box padding="major-3" background="#ffffff" border="1px solid #cccccc">
    <EditorForm />
  </Box>
))

stories.add("json schema editor", () => (
  <Box padding="major-3" background="#ffffff" border="1px solid #cccccc">
    <EditorJsonSchema />
  </Box>
))
