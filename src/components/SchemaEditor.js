import React from "react"
import { Box } from "fannypack"
import styled, { css } from "styled-components"
import { UnControlled as CodeMirror } from "react-codemirror2"
import "codemirror/lib/codemirror.css"
import "codemirror/mode/javascript/javascript"
import "codemirror/keymap/vim"
import { orderSchema } from "../helpers/model"
import { pretty } from "../helpers/utils"

export const styles = css`
  .CodeMirror {
    height: auto;
    font-family: Menlo, Monaco, "Courier New", monospace;
    font-size: 14px;
    line-height: 1.25;
  }
`

export default styled(({ ...otherProps }) => {
  return (
    <Box {...otherProps}>
      <CodeMirror
        value={pretty(orderSchema, 1)}
        options={{
          mode: { name: "javascript", jsonld: true },
          keyMap: "vim",
          lineNumbers: false,
          _readOnly: "nocursor",
          viewportMargin: Infinity,
        }}
      />
    </Box>
  )
})(styles)
