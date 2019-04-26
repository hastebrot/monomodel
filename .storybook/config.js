import { configure, addParameters } from "@storybook/react"
import { themes } from "@storybook/theming"

addParameters({
  options: {
    name: "monomodel storybook",
    theme: themes.light,
    showPanel: false,
    sortStoriesByKind: true,
    sidebarAnimations: false,
    isToolshown: true,
  },
})

function loadStories() {
  const req = require.context("../src/stories", true, /\.story\.js$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
