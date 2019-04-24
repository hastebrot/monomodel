import React, { Fragment, useContext } from "react"
import { Box, Text, Code, ThemeProvider, css } from "fannypack"
import { compact } from "lodash-es"

//------------------------------------------------------------------------------
// FORM COMPONENTS.
//------------------------------------------------------------------------------

export const FormRoot = ({ rootModel, rootView = null }) => {
  const { registry, queryComponent } = useContext(FormContext)
  return (
    <Box
      use={rootView || queryComponent(registry, "FormObject", rootModel)}
      node={rootModel}
      path={`root`}
    />
  )
}

export const FormObject = ({ node, path }) => {
  const { registry, queryComponent } = useContext(FormContext)
  return (
    <Box
      use={queryComponent(registry, "FormPart", node)}
      node={node}
      path={path}
    >
      {node.children && (
        <Box
          use={queryComponent(registry, "FormArray", node.children)}
          items={node.children}
          path={`${path}.children`}
        />
      )}
    </Box>
  )
}

export const FormArray = ({ items, path }) => {
  const { registry, queryComponent } = useContext(FormContext)
  return items.map((item, index) => (
    <Fragment key={index}>
      <Box
        use={queryComponent(registry, "FormObject", item)}
        node={item}
        path={`${path}[${index}]`}
      />
    </Fragment>
  ))
}

export const FormPart = ({ node, path, children }) => {
  return (
    <Box>
      <Box
        margin="major-1"
        padding="major-1"
        backgroundColor="danger"
        color="white"
      >
        <Text>
          Error: <Code>&lt;FormPart&gt;</Code> for type{" "}
          <Code>{createFormPartType(node.type, node.datatype)}</Code> at path{" "}
          <Code>{path}</Code> not found.
        </Text>
      </Box>
      <Box>{children}</Box>
    </Box>
  )
}

export const createFormPartType = (...types) => {
  return compact(types)
    .join("-")
    .toLowerCase()
}

//------------------------------------------------------------------------------
// FORM CONTEXT.
//------------------------------------------------------------------------------

export const FormContext = React.createContext(null)

export const ContextProvider = ({
  localTheme = null,
  formContext = null,
  children,
}) => {
  return (
    <ThemeProvider theme={localTheme}>
      <FormContext.Provider value={formContext}>
        <Fragment>{children}</Fragment>
      </FormContext.Provider>
    </ThemeProvider>
  )
}

export const defaultFormContext = (modifyFormContext = context => context) => {
  const context = {
    registry: { FormObject, FormArray, FormPart },
    queryComponent(registry, name, data) {
      return registry[name]
    },
  }
  return modifyFormContext(context)
}

export const defaultLocalTheme = (modifyLocalTheme = theme => theme) => {
  return modifyLocalTheme(localTheme)
}

export const localTheme = {
  Pane: {
    base: css`
      border-radius: 0;
    `
  },
  Heading: {
    h2: css`
      font-size: 20px;
      line-height: unset;
    `,
  },
  Input: {
    base: css`
      border: 1px solid #cccccc !important;
      border-radius: 0;
      box-shadow: unset !important;
      height: 50px;
      padding: 0 15px;
    `
  }
}

//------------------------------------------------------------------------------
// FORM MODEL.
//------------------------------------------------------------------------------

export const buildFormModel = definitionFn => {
  const helpers = { fieldset, field }
  return definitionFn(helpers)
}
export const buildDefinition = (type, payload) => {
  return { type, ...payload }
}
export const fieldset = (datatype, payload = {}) =>
  buildDefinition("fieldset", { datatype, ...payload })
export const field = (datatype, payload = {}) =>
  buildDefinition("field", { datatype, ...payload })

export const simpleFormModel = () => {
  return fieldset("object", {
    pointer: "#/",
    title: "order",
    children: [
      field("string", {
        pointer: "#/properties/orderNumber",
      }),
      field("string", {
        pointer: "#/properties/orderDate",
      }),
      fieldset("object", {
        pointer: "#/properties/customer",
        children: [
          field("string", {
            pointer: "#/properties/customer/properties/customerNumber",
          }),
          field("string", {
            pointer: "#/properties/customer/properties/firstName",
          }),
          field("string", {
            pointer: "#/properties/customer/properties/lastName",
          }),
        ],
      }),
    ],
  })
}
