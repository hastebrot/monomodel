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

export const Form = () => {
  const [formModel, setFormModel] = useState(simpleFormModel())
  const localTheme = defaultLocalTheme()
  const formContext = defaultFormContext(
    produce(context => {
      context.registry.FormPart = EditorFormPart
      context.formModel = formModel
      context.setFormModel = setFormModel
      context.colorScale = chroma.scale(["white", "red"]).mode("lab")
    })
  )
  return (
    <ContextProvider formContext={formContext} localTheme={localTheme}>
      <FormRoot rootModel={formModel} />
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

  if (node.type === "fieldset") {
    return (
      <DropBox
        name={path}
        onDragOver={onDragOver}
        onDrop={event => onDrop(event, path)}
      >
        <Pane>
          <Box marginBottom="major-2">
            <Flex row>
              <Heading use="h2" flex="1">
                {node.pointer}
              </Heading>
            </Flex>
          </Box>
          <Set isVertical isFilled spacing="major-2">
            {children}
          </Set>
        </Pane>
      </DropBox>
    )
  }
  if (node.type === "field") {
    return (
      <DragBox
        name={path}
        onMouseOver={event => onMouseOver(event, path)}
        onDragStart={event => onDragStart(event, path)}
      >
        <Input defaultValue={node.pointer} />
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
