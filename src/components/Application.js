import React, { Fragment } from "react"
import { Box } from "fannypack"
import { PrettyCode } from "../utils"
import { taskSchema, taskModel } from "../tests/fixture"

export default () => {
  return (
    <Fragment>
      <Box>
        <PrettyCode value={taskSchema} />
        <PrettyCode value={taskModel} />
      </Box>
    </Fragment>
  )
}
