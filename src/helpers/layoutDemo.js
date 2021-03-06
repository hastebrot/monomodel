import React, { Fragment, useState, useEffect, useContext } from "react"
import { produce } from "immer"
import { get } from "lodash-es"
import { Box, Flex, Heading, Text, InputField } from "fannypack"
import { List, arrayMove } from "react-movable"
import GridLayout from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import {
  FormRoot,
  FormContext,
  ContextProvider,
  defaultFormContext,
  defaultLocalTheme,
} from "../components/FormRoot"
import { object, array, string, boolean, number } from "../helpers/model"
import { buildFlatModel } from "../helpers/builder"
import { pretty } from "../helpers/utils"

export const FormDemoOne = () => {
  const formModel = buildFlatModel(orderSchema)
  const formRegistry = {
    FormArray: EditorFormArray,
    FormPart: EditorFormPart,
  }
  return <FormViewer model={formModel} registry={formRegistry} />
}

export const FormDemoTwo = () => {
  const formModel = buildFlatModel(orderSchema)
  const formRegistry = {
    FormArray: EditorFormArrayGrid,
    FormPart: EditorFormPart,
  }
  return <FormViewer model={formModel} registry={formRegistry} />
}

export const EditorFormArrayGrid = ({ items, path }) => {
  const { registry, queryComponent, setFormModel } = useContext(FormContext)
  const gridOptions = {
    width: 550,
    cols: 6,
    rowHeight: 65,
    margin: [16, 16],
    containerPadding: [0, 0],
    compactType: "vertical",
  }
  return (
    <Fragment>
      <Box>
        {items[0] && items[0].type === "field" && (
          <GridLayout style={{ marginBottom: "16px" }} {...gridOptions}>
            {items.map((item, index) => (
              <Box
                key={`${item.pointer}@${index}`}
                data-grid={{ x: 0, y: 0, w: 3, h: 1, minW: 3, maxH: 2 }}
              >
                <Box
                  use={queryComponent(registry, "FormObject", item)}
                  node={item}
                  path={`${path}[${index}]`}
                />
              </Box>
            ))}
          </GridLayout>
        )}
      </Box>
      {items[0] && items[0].type !== "field" && (
        <Fragment>
          {items.map((item, index) => (
            <Box key={`${item.pointer}@${index}`}>
              <Box
                use={queryComponent(registry, "FormObject", item)}
                node={item}
                path={`${path}[${index}]`}
              />
            </Box>
          ))}
        </Fragment>
      )}
    </Fragment>
  )
}

export const EditorFormArray = ({ items, path }) => {
  const { registry, queryComponent, setFormModel } = useContext(FormContext)
  return (
    <List
      lockVertically
      _transitionDuration={0}
      values={items}
      onChange={({ oldIndex, newIndex }) => {
        setFormModel(
          produce(formModel => {
            const array = get({ root: formModel }, path)
            arrayMoveMutate(array, oldIndex, newIndex)
          })
        )
      }}
      renderList={({ children, props }) => {
        return <Box {...props}>{children}</Box>
      }}
      renderItem={({ value, index, props }) => {
        return (
          <Box {...props} key={`${value.pointer}@${index}`}>
            <Box
              use={queryComponent(registry, "FormObject", value)}
              node={value}
              path={`${path}[${index}]`}
            />
          </Box>
        )
      }}
    />
  )
}

export const FormDemoThree = () => {
  const formModel = buildFlatModel(orderSchema)
  const formRegistry = {
    FormPart: EditorFormPart,
  }
  return <FormViewer model={formModel} registry={formRegistry} />
}

export const FormViewer = ({
  model = null,
  registry = null,
  ...otherProps
}) => {
  const [formModel, setFormModel] = useState(model)
  const localTheme = defaultLocalTheme()
  const formContext = defaultFormContext(
    produce(context => {
      context.registry = { ...context.registry, ...registry }
      context.formModel = formModel
      context.setFormModel = setFormModel
    })
  )
  return (
    <ContextProvider formContext={formContext} localTheme={localTheme}>
      <Box
        _paddingTop="major-2"
        paddingLeft="major-2"
        paddingRight="major-2"
        color="#121212"
        {...otherProps}
      >
        {formModel && <FormRoot rootModel={formModel} />}
      </Box>
    </ContextProvider>
  )
}

export const EditorFormPart = ({ node, path, children }) => {
  const context = useContext(FormContext)

  const header = node.pointer ? (
    <Text>
      {node.title} <Text use="small">{node.pointer}</Text>
    </Text>
  ) : null

  const rowPadding = paddingPx => {
    return {
      paddingLeft: `${paddingPx}`,
      paddingRight: `${paddingPx}`,
      marginLeft: `-${paddingPx}`,
      marginRight: `-${paddingPx}`,
    }
  }

  if (node.type === "fieldset") {
    return (
      <DropBox>
        <Box
          {...rowPadding("16px")}
          backgroundColor="#fff"
          border={`1px solid ${node.pointer ? "red" : "red"}`}
          cursor="move"
        >
          {header && (
            <Box {...rowPadding("16px")} paddingBottom="8px">
              <Heading use="h2" paddingTop="8px" paddingBottom="8px">
                <Fragment>{header}</Fragment>
              </Heading>
            </Box>
          )}
          {children && <Box {...rowPadding("16px")}>{children}</Box>}
        </Box>
      </DropBox>
    )
  }
  if (node.type === "field") {
    return (
      <DragBox>
        <Box marginBottom="16px" border="1px solid blue" backgroundColor="#fff">
          <InputField
            label={node.pointer.split("/").slice(-1)[0]}
            defaultValue={node.pointer}
            readOnly
          />
        </Box>
      </DragBox>
    )
  }
  throw new Error("node.type handler not defined")
}

export const DropBox = ({ children, name, ...otherProps }) => {
  return <Box {...otherProps}>{children}</Box>
}

export const DragBox = ({ children, name, ...otherProps }) => {
  return (
    <Box _draggable {...otherProps}>
      {children}
    </Box>
  )
}

const arrayMoveMutate = (array, indexFrom, indexTo) => {
  array.splice(
    indexTo < 0 ? array.length + indexTo : indexTo,
    0,
    array.splice(indexFrom, 1)[0]
  )
}

export const orderSchema = object({
  $schema: "http://json-schema.org/schema#",
  title: "order",
  properties: {
    orderNumber: string(),
    orderDate: string(),
    customer: object({
      title: "customer",
      properties: {
        customerNumber: string(),
        firstName: string(),
        lastName: string(),
      },
    }),
  },
})
