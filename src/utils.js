import React from "react"

//------------------------------------------------------------------------------
// PRETTY CODE.
//------------------------------------------------------------------------------

export const PrettyCode = ({ value, indent = 2, ...otherProps }) => {
  return (
    <pre
      style={{
        margin: "25px",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        color: "#000",
        fontSize: "13px",
      }}
      {...otherProps}
    >
      <code>{pretty(value, indent)}</code>
    </pre>
  )
}

export const pretty = (value, indent = 2) =>
  JSON.stringify(value, undefined, indent)

export const pretty1 = value =>
  pretty(value, 1)
    .split("\n")
    .map(it => it.trim())
    .join(" ")

export const pretty0 = value => pretty(value, 0)
