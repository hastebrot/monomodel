import React, { Fragment } from "react"
import { HashRouter, Route, Switch } from "react-router-dom"
import { ThemeProvider, css, defaultTheme } from "fannypack"
import SelectionTiles from "../pages/SelectionTiles"

export default () => {
  return (
    <ApplicationContextProvider>
      <ApplicationRoutes />
    </ApplicationContextProvider>
  )
}

export const ApplicationRoutes = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={SelectionTiles} />
      </Switch>
    </HashRouter>
  )
}

export const ApplicationContext = React.createContext({})

export const ApplicationContextProvider = ({
  children,
  theme = applicationTheme,
}) => {
  return (
    <ThemeProvider theme={theme} isStandalone>
      <Fragment>{children}</Fragment>
    </ThemeProvider>
  )
}

export const applicationTheme = defaultTheme({
  global: {
    base: css`
      body,
      #root {
        margin: 0;
        height: 100vh;
      }
    `,
  },
  Pane: {
    base: css`
      border-radius: 0;
    `,
  },
})
