import React, { Fragment, useEffect } from "react"
import { Box, Pane } from "fannypack"
import useStoreon from "storeon/react"
import "typeface-open-sans"
import "typeface-open-sans-condensed"
import { FORMS_CREATE } from "../store/forms"
import { PrettyCode } from "../helpers/utils"

export default ({ ...otherProps }) => {
  const { dispatch, forms } = useStoreon("forms")

  useEffect(() => {
    dispatch(FORMS_CREATE)
  }, [])

  return (
    <Pane
      border
      margin="0 auto"
      padding="major-5"
      fontFamily="open sans"
      maxWidth="900px"
      {...otherProps}
    >
      <Fragment>selection tiles</Fragment>
      <PrettyCode value={forms} />
    </Pane>
  )
}
