import React from "react"

export const check = (condition, message = () => "condition is false") => {
  if (!condition) {
    throw new Error(message())
  }
}

export const checkNotNil = (value, message = () => "value is nil") => {
  if (isNil(value)) {
    throw new Error(message())
  }
}

export const isNil = value => {
  return value === null || value === undefined
}

export const PrettyCode = ({ value, indent = 2, ...otherProps }) => {
  return (
    <pre
      style={{
        margin: "0",
        padding: "0",
        color: "#000",
        fontSize: "13px",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
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
