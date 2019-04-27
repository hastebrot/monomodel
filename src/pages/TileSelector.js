import React, { Fragment, useEffect, useState } from "react"
import { Box, Pane, Flex, Set, Heading, Text, Link } from "fannypack"
import useStoreon from "storeon/react"
import "typeface-open-sans"
import "typeface-open-sans-condensed"
import { FORMS_CREATE } from "../store/forms"
import { PrettyCode } from "../helpers/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"

export default ({ ...otherProps }) => {
  const { dispatch, forms } = useStoreon("forms")
  const [tiles, setTiles] = useState(null)

  useEffect(() => {
    dispatch(FORMS_CREATE)
    setTiles(["inky", "blinky", "pinky", "clyde"])
  }, [])

  return (
    <Pane
      border
      margin="0 auto"
      padding="major-5"
      fontFamily="open sans"
      maxWidth="1080px"
      {...otherProps}
    >
      <Heading use="h2">selection tiles</Heading>
      <Box paddingTop="major-2">
        <PrettyCode value={forms} />
      </Box>
      <Set isFilled spacing="major-3" marginTop="major-3">
        <Tile dashed>
          <Link href="#/form">
            <Flex row justifyContent="center">
              <Box paddingRight="major-1">
                <FontAwesomeIcon icon={faPlusCircle} size="lg" />
              </Box>
              <Text>New form</Text>
            </Flex>
          </Link>
        </Tile>
        {tiles && tiles.map(tile => <Tile key={tile}>{tile}</Tile>)}
      </Set>
    </Pane>
  )
}

export const Tile = ({ children, dashed = false, ...otherProps }) => {
  return (
    <Flex
      border={!dashed ? "1px solid #ccc" : "1px dashed #ccc"}
      borderRadius="8px"
      backgroundColor={!dashed ? "#efefef" : null}
      width="calc(33.33% - 24px)"
      height="160px"
      padding="major-2"
      alignItems="center"
      justifyContent="center"
      {...otherProps}
    >
      {children}
    </Flex>
  )
}
