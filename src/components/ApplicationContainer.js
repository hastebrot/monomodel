import React, { Fragment } from "react"
import { HashRouter, Route, Switch } from "react-router-dom"
import { ThemeProvider, css, defaultTheme } from "fannypack"
import { SelectionTiles } from "../pages"
import { StoreContextProvider } from "../store"

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
    <StoreContextProvider>
      <ThemeProvider theme={theme} isStandalone>
        <Fragment>{children}</Fragment>
      </ThemeProvider>
    </StoreContextProvider>
  )
}

export const applicationTheme = defaultTheme({
  global: {
    base: css`
      body,
      #root {
        margin: 0;
        height: 100vh;
        color: #121212;
      }
    `,
  },
  Pane: {
    base: css`
      border-radius: 0;
    `,
  },
})
