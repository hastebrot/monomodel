import React, { Fragment } from "react"
import { Pane } from "fannypack"
import "typeface-open-sans"
import "typeface-open-sans-condensed"

export default ({ ...otherProps }) => {
  return (
    <Pane
      border
      margin="major-5"
      padding="major-5"
      fontFamily="open sans"
      {...otherProps}
    >
      <Fragment>selection tiles</Fragment>
    </Pane>
  )
}
