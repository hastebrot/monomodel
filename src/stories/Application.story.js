import React, { Fragment } from "react"
import { storiesOf } from "@storybook/react"
import { Pane, ThemeProvider } from "fannypack"
import Application from "../components/Application"

const stories = storiesOf("Components/Application", module)

stories.addDecorator(story => (
  <ThemeProvider>
    <Pane padding="major-2">{story()}</Pane>
  </ThemeProvider>
))

stories.add("default", () => (
  <Fragment>
    <Application />
  </Fragment>
))
