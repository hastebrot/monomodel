import { configure, addParameters } from "@storybook/react"
import { themes } from "@storybook/theming"

addParameters({
  options: {
    theme: themes.light,
    showPanel: false,
    sortStoriesByKind: true,
    sidebarAnimations: false,
  },
})

function loadStories() {
  const req = require.context("../src/stories", true, /\.story\.js$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
