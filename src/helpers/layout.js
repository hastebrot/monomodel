import React, { Fragment, useEffect, useState } from "react"
import { Box, ThemeProvider } from "fannypack"
import { produce } from "immer"

export const UseGridPositionsDemo = () => {
  const { items, setItems, toItemProps, containerProps } = useGridPositions({
    containerSize: { w: 2, h: 4 },
    initialItems: [
      { id: 0, text: "0", bounds: { y: 0, x: 0, h: 1, w: 2 } },
      { id: 1, text: "1", bounds: { y: 1, x: 0, h: 1, w: 1 } },
      { id: 2, text: "2", bounds: { y: 1, x: 1, h: 1, w: 1 } },
      { id: 3, text: "3", bounds: { y: 2, x: 1, h: 1, w: 1 } },
      { id: 4, text: "4", bounds: { y: 3, x: 0, h: 1, w: 1 } },
    ],
  })

  useEffect(() => {
    setItems(
      produce(items => {
        moveArrayItemInplace(items, 0, 2)
      })
    )
  }, [])

  return (
    <ThemeProvider>
      <Box {...containerProps}>
        {items.map(item => (
          <Fragment key={item.id}>
            <Box
              padding="10px"
              border="1px solid #ccc"
              backgroundColor="#fff"
              {...toItemProps(item.id)}
            >
              {item.text}
            </Box>
          </Fragment>
        ))}
      </Box>
    </ThemeProvider>
  )
}

export const useGridPositions = ({ initialItems, containerSize }) => {
  const [items, setItems] = useState(initialItems)
  const verticalScaleFactor = 50
  return {
    containerProps: {
      position: "relative",
      width: "100%",
      height: `${containerSize.h * verticalScaleFactor}px`,
    },
    items,
    setItems,
    toItemProps: id => {
      const item = items.find(item => item.id === id)
      const itemBounds = {
        x: (item.bounds.x / containerSize.w) / (item.bounds.w / containerSize.w),
        y: (item.bounds.y / containerSize.h) * (containerSize.h * verticalScaleFactor),
        w: item.bounds.w / containerSize.w,
        h: item.bounds.h * verticalScaleFactor,
      }
      return {
        position: "absolute",
        width: `${itemBounds.w * 100}%`,
        height: `${itemBounds.h}px`,
        transform: `translate(${itemBounds.x * 100}%, ${itemBounds.y}px)`,
      }
    },
  }
}

export const UseGridColumnsDemo = () => {
  const CONTAINER_COLUMNS = "repeat(2, 1fr)"
  const FULL_COLUMN = "1 / span 2"
  const HALF_COLUMN = "span 1"
  const LEFT_COLUMN = "1 / span 1"
  const RIGHT_COLUMN = "2 / span 1"

  const { items, setItems, toItemProps, containerProps } = useGridColumns({
    containerColumns: CONTAINER_COLUMNS,
    initialItems: [
      { id: 0, text: "0", columns: FULL_COLUMN },
      { id: 1, text: "1", columns: HALF_COLUMN },
      { id: 2, text: "2", columns: HALF_COLUMN },
      { id: 3, text: "3", columns: RIGHT_COLUMN },
      { id: 4, text: "4", columns: LEFT_COLUMN },
    ],
  })

  useEffect(() => {
    setItems(
      produce(items => {
        moveArrayItemInplace(items, 0, 2)
      })
    )
  }, [])

  return (
    <ThemeProvider>
      <Box {...containerProps}>
        {items.map(item => (
          <Fragment key={item.id}>
            <Box
              padding="10px"
              border="1px solid #ccc"
              backgroundColor="#fff"
              {...toItemProps(item.id)}
            >
              {item.text}
            </Box>
          </Fragment>
        ))}
      </Box>
    </ThemeProvider>
  )
}

export const useGridColumns = ({ initialItems, containerColumns }) => {
  const [items, setItems] = useState(initialItems)
  return {
    containerProps: {
      display: "grid",
      gridTemplateColumns: containerColumns,
      gridColumnGap: "16px",
      gridRowGap: "16px",
    },
    items,
    setItems,
    toItemProps: id => {
      const item = items.find(item => item.id === id)
      return {
        gridColumn: item.columns,
      }
    },
  }
}

export const moveArrayItemInplace = (array, indexFrom, indexTo) => {
  array.splice(
    indexTo < 0 ? array.length + indexTo : indexTo,
    0,
    array.splice(indexFrom, 1)[0]
  )
}
