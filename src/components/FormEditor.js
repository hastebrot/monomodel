import React, { Fragment, useState, useContext } from "react"
import { produce } from "immer"
import { get } from "lodash-es"
import { Box, Flex, Heading, Text, InputField } from "fannypack"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTrashAlt,
  faGripLinesVertical,
} from "@fortawesome/free-solid-svg-icons"
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import {
  FormRoot,
  FormContext,
  ContextProvider,
  defaultFormContext,
  defaultLocalTheme,
  simpleFormModel,
} from "./FormRoot"
// import { taskSchema, taskModel } from "../library/model"
// import { PrettyCode } from "../library/utils"

export default ({
  model = simpleFormModel(),
  prefs = { options: {} },
  ...otherProps
}) => {
  const [formModel, setFormModel] = useState(model)
  const [formPrefs, setFormPrefs] = useState(prefs)
  const localTheme = defaultLocalTheme()
  const formContext = defaultFormContext(
    produce(context => {
      context.registry.FormPart = EditorFormPart
      context.formModel = formModel
      context.setFormModel = setFormModel
      context.formPrefs = formPrefs
      context.setFormPrefs = setFormPrefs
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
        <FormRoot rootModel={formModel} />
      </Box>
    </ContextProvider>
  )
}

export const EditorFormPart = ({ node, path, children }) => {
  const context = useContext(FormContext)

  const onSelectClick = event => {
    context.setFormPrefs(
      produce(formPrefs => {
        const selectedFieldset =
          formPrefs.selectedFieldset === path ? null : path
        formPrefs.selectedFieldset = selectedFieldset
      })
    )
    event.stopPropagation()
  }
  const isSelected = path === context.formPrefs.selectedFieldset
  const isFieldSelected = path.includes(context.formPrefs.selectedFieldset)
  const isActive = context.formPrefs.selectedFieldset ? isFieldSelected : true

  const pointerPrefs = {
    ...context.formPrefs[node.pointer],
  }
  const header = node.pointer ? (
    <Text>
      {node.title} <Text use="small">{node.pointer}</Text>
    </Text>
  ) : null

  const fontSizesHeader = context.formPrefs.options.fontSizesHeader
  const fontSize = fontSizesHeader
    ? fontSizesHeader[path.split(".").length]
    : null

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
      <DropBox
        gridColumn={pointerPrefs.gridColumn}
        name={path}
        onDragOver={onDragOver}
        onDrop={event => onDrop(event, path)}
        position="relative"
      >
        {isSelected && (
          <Fragment>
            <Flex
              column
              alignItems="center"
              position="absolute"
              top="10px"
              left="-50px"
              width="20px"
            >
              <FontAwesomeIcon icon={faTrashAlt} size="lg" color="#d70004" />
            </Flex>
            <Flex
              column
              alignItems="center"
              position="absolute"
              top="50%"
              left="-50px"
              width="20px"
            >
              <FontAwesomeIcon
                icon={faGripLinesVertical}
                size="lg"
                color="#aaaaaa"
              />
            </Flex>
          </Fragment>
        )}
        <Box
          {...rowPadding("16px")}
          onClick={onSelectClick}
          backgroundColor={isSelected ? "#fbd9d2" : undefined}
        >
          {header && (
            <Box
              {...rowPadding("16px")}
              color={get(pointerPrefs, "header.color")}
              backgroundColor={get(pointerPrefs, "header.backgroundColor")}
              opacity={!isActive ? "0.25" : null}
              pointerEvents={!isActive ? "none" : null}
              paddingBottom="8px"
            >
              <Heading
                use="h2"
                paddingTop="8px"
                paddingBottom="8px"
                fontSize={fontSize}
              >
                <Fragment>{header}</Fragment>
              </Heading>
            </Box>
          )}
          {children && (
            <Box
              {...rowPadding("16px")}
              color={get(pointerPrefs, "body.color")}
              backgroundColor={get(pointerPrefs, "body.backgroundColor")}
              display="grid"
              gridTemplateColumns={pointerPrefs.gridTemplateColumns}
              gridColumnGap="16px"
              gridRowGap="0"
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
        gridColumn={pointerPrefs.gridColumn}
        name={path}
        onMouseOver={event => onMouseOver(event, path)}
        onDragStart={event => onDragStart(event, path)}
      >
        <Box
          paddingBottom="16px"
          opacity={!isActive ? "0.25" : null}
          pointerEvents={!isActive ? "none" : null}
        >
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
