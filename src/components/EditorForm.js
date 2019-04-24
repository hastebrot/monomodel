import React, { Fragment, useState, useContext } from "react"
import { produce } from "immer"
import {
  Box,
  Flex,
  Set,
  Group,
  Button,
  Label,
  Heading,
  Input,
  Pane,
} from "fannypack"
import {
  FormRoot,
  FormContext,
  ContextProvider,
  defaultFormContext,
  defaultLocalTheme,
  simpleFormModel,
} from "./forms"
import { PrettyCode } from "../utils"
import { taskSchema, taskModel } from "../tests/fixture"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import chroma from "chroma-js"

export const Form = ({ model = simpleFormModel(), prefs = {} }) => {
  const [formModel, setFormModel] = useState(model)
  const localTheme = defaultLocalTheme()
  const formContext = defaultFormContext(
    produce(context => {
      context.registry.FormPart = EditorFormPart
      context.formModel = formModel
      context.formPrefs = prefs
      context.setFormModel = setFormModel
      context.colorScale = chroma.scale(["white", "red"]).mode("lab")
    })
  )
  return (
    <ContextProvider formContext={formContext} localTheme={localTheme}>
      <Box paddingTop="major-2" paddingLeft="major-2" paddingRight="major-2">
        <FormRoot rootModel={formModel} />
      </Box>
    </ContextProvider>
  )
}

export const DropBox = ({ children, name, ...otherProps }) => {
  return <Box {...otherProps}>{children}</Box>
}

export const DragBox = ({ children, name, ...otherProps }) => {
  return (
    <Box draggable {...otherProps}>
      {children}
    </Box>
  )
}

const onDragStart = (event, path) => {
  console.log("drag start:", path, event.currentTarget)
  event.dataTransfer.setData("path", path)

  const emptyImage = new Image()
  emptyImage.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
  event.dataTransfer.setDragImage(emptyImage, 0, 0)
}

const onDragOver = (event, path) => {
  event.preventDefault()
}

const onDrop = (event, path) => {
  event.preventDefault()
  const data = event.dataTransfer.getData("path")
  console.log("drop:", path, event.currentTarget, data)
  const point = {
    x: event.nativeEvent.clientX,
    y: event.nativeEvent.clientY,
  }
  const clientRect = event.currentTarget.getBoundingClientRect()
  const bounds = {
    x: clientRect.x,
    y: clientRect.y,
    width: clientRect.width,
    height: clientRect.height,
  }
  console.log("drop point and bounds:", point, bounds)
}

const onMouseOver = (event, path) => {}

export const EditorFormPart = ({ node, path, children }) => {
  const context = useContext(FormContext)
  const calculateColor = path => context.colorScale(path.split(".").length / 3)

  const [isHover, setIsHover] = useState(false)
  const _onMouseOver = event => {
    if (event.target === event.currentTarget) {
      event.stopPropagation()
    }
    setIsHover(true)
  }
  const _onMouseOut = event => {
    if (event.target === event.currentTarget) {
      event.stopPropagation()
    }
    setIsHover(false)
  }

  const prefs = context.formPrefs[node.pointer] || {}

  if (node.type === "fieldset") {
    return (
      <DropBox
        gridColumn={prefs.gridColumn}
        name={path}
        onDragOver={onDragOver}
        onDrop={event => onDrop(event, path)}
      >
        <Box
          marginLeft="-16px"
          paddingLeft="16px"
          marginRight="-16px"
          paddingRight="16px"
          backgroundColor={prefs.backgroundColorContainer}
        >
          <Box
            marginLeft="-16px"
            paddingLeft="16px"
            marginRight="-16px"
            paddingRight="16px"
            color={prefs.colorHeader}
            backgroundColor={prefs.backgroundColorHeader}
          >
            <Heading use="h2" _paddingTop="8px" _paddingBottom="8px">
              {node.pointer}
            </Heading>
          </Box>
          {children && (
            <Box
              onMouseOver={_onMouseOver}
              onMouseOut={_onMouseOut}
              paddingTop="16px"
              marginLeft="-16px"
              paddingLeft="16px"
              marginRight="-16px"
              paddingRight="16px"
              backgroundColor={prefs.backgroundColorContent}
              _backgroundColor={isHover ? "tomato" : undefined}
              display="grid"
              gridTemplateColumns={prefs.gridTemplateColumns}
              gridColumnGap="16px"
              _gridRowGap="16px"
            >
              {children}
            </Box>
          )}
        </Box>
      </DropBox>
    )
  }
  if (node.type === "field") {
    return (
      <DragBox
        gridColumn={prefs.gridColumn}
        name={path}
        onMouseOver={event => onMouseOver(event, path)}
        onDragStart={event => onDragStart(event, path)}
      >
        <Box paddingBottom="16px">
          <Input defaultValue={node.pointer} />
        </Box>
      </DragBox>
    )
  }
  throw new Error("node.type handler not defined")
}

export default () => {
  return (
    <Fragment>
      <Box>
        <Form />
        {/* <PrettyCode value={taskSchema} /> */}
        {/* <PrettyCode value={taskModel} /> */}
      </Box>
    </Fragment>
  )
}
