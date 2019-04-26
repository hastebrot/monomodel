import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import ApplicationContainer from "./components/ApplicationContainer"

const rootNode = document.querySelector("#root")
ReactDOM.render(
  <Fragment>
    <ApplicationContainer />
  </Fragment>,
  rootNode
)
