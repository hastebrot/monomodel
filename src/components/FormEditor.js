import React, { Fragment, useState, useContext } from "react"
import { produce } from "immer"
import { Box, Flex, Heading, Input } from "fannypack"
import chroma from "chroma-js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTrashAlt,
  faGripLinesVertical,
} from "@fortawesome/free-solid-svg-icons"
import "typeface-open-sans"
import "typeface-open-sans-condensed"
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

export default ({ model = simpleFormModel(), prefs = {}, ...otherProps }) => {
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

  const fieldsetFontFamily = "open sans condensed"
  const fieldFontFamily = "open sans"

  const prefs = {
    active: context.formPrefs.defaultActive,
    ...context.formPrefs[node.pointer],
  }
  const header = node.pointer
  // const header = node.title

  const fontSize = context.formPrefs.headerFontSizes
    ? context.formPrefs.headerFontSizes[path.split(".").length]
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
        gridColumn={prefs.gridColumn}
        name={path}
        onDragOver={onDragOver}
        onDrop={event => onDrop(event, path)}
        position="relative"
      >
        {prefs.selected && (
          <Fragment>
            <Flex
              column
              alignItems="center"
              position="absolute"
              top="16px"
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
          backgroundColor={prefs.backgroundColorContainer}
        >
          {header && (
            <Box
              {...rowPadding("16px")}
              color={prefs.colorHeader}
              backgroundColor={prefs.backgroundColorHeader}
              opacity={!prefs.active ? "0.25" : null}
              pointerEvents={!prefs.active ? "none" : null}
              fontFamily={fieldsetFontFamily}
            >
              <Heading
                use="h2"
                paddingTop="8px"
                _paddingBottom="8px"
                fontSize={fontSize}
              >
                <Fragment>{header}</Fragment>
                {/* <Fragment>{path}</Fragment> */}
              </Heading>
            </Box>
          )}
          {children && (
            <Box
              {...rowPadding("16px")}
              onMouseOver={_onMouseOver}
              onMouseOut={_onMouseOut}
              paddingTop={header ? "16px" : undefined}
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
          {!children && (
            <Box
              {...rowPadding("16px")}
              paddingTop={header ? "16px" : undefined}
            />
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
        <Box
          paddingBottom="16px"
          opacity={!prefs.active ? "0.25" : null}
          pointerEvents={!prefs.active ? "none" : null}
          fontFamily={fieldFontFamily}
        >
          <Input defaultValue={node.pointer} />
          {/* <Input defaultValue={path} /> */}
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
