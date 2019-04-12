import React, { Fragment, useState } from "react"
import { produce } from "immer"
import { Box, Flex, Set, Group, Button, Label, Input, Pane } from "fannypack"
import {
  FormRoot,
  ContextProvider,
  defaultFormContext,
  simpleFormModel,
} from "./forms"
import { PrettyCode } from "../utils"
import { taskSchema, taskModel } from "../tests/fixture"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

export const Form = () => {
  const [formModel, setFormModel] = useState(simpleFormModel())
  const formContext = defaultFormContext(
    produce(context => {
      context.registry.FormPart = EditorFormPart
      context.formModel = formModel
      context.setFormModel = setFormModel
    })
  )
  return (
    <ContextProvider formContext={formContext}>
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
}

const onDragOver = (event, path) => {
  event.preventDefault()
}

const onDrop = (event, path) => {
  event.preventDefault()
  const data = event.dataTransfer.getData("path")
  console.log("drop:", path, event.currentTarget, data)
}

const onMouseOver = (event, path) => {}

export const EditorFormPart = ({ node, path, children }) => {
  if (node.type === "fieldset") {
    return (
      <DropBox
        name={path}
        onDragOver={onDragOver}
        onDrop={event => onDrop(event, path)}
      >
        <Pane padding="major-2" border>
          <Box marginBottom="major-1" padding="major-1" background="orange">
            <Flex row>
              <Label flex="1">{node.pointer}</Label>
              <Group>
                <Button size="small">1-column</Button>
                <Button size="small">2-column</Button>
              </Group>
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
        <Box marginBottom="major-1" padding="major-1" background="tomato" />
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
