import React, { Fragment, useEffect, useState } from "react"
import { Box, Pane, Flex, Set, Heading, Text, Link } from "fannypack"
import useStoreon from "storeon/react"
import { round } from "lodash"
import { DateTime } from "luxon"
import "typeface-open-sans"
import "typeface-open-sans-condensed"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { FORMS_CREATE } from "../store/forms"

export default ({ ...otherProps }) => {
  const { dispatch, forms } = useStoreon("forms")
  const [tiles, setTiles] = useState(null)

  const lastModification = DateTime.local(2019, 4, 1, 12, 0, 0)
  const now = DateTime.local()
  const durationText = formatDuration(now.diff(lastModification))

  useEffect(() => {
    dispatch(FORMS_CREATE)
    setTiles(["inky", "blinky", "pinky", "clyde"])
  }, [])

  return (
    <Box
      backgroundColor="#f7f7f8"
      paddingLeft="major-5"
      paddingRight="major-5"
      paddingBottom="major-5"
      height="100vh"
      {...otherProps}
    >
      <Pane
        border
        margin="0 auto"
        padding="major-5"
        fontFamily="open sans"
        maxWidth="1080px"
      >
        <Heading use="h2">tile selector</Heading>
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
          {tiles &&
            tiles.map(tile => {
              return (
                <Tile key={tile}>
                  <Flex column alignItems="center">
                    <Link href="#/form">{tile}</Link>
                    <Text use="small" className="small">
                      {durationText}
                    </Text>
                  </Flex>
                </Tile>
              )
            })}
        </Set>
      </Pane>
    </Box>
  )
}

export const Tile = ({ children, dashed = false, ...otherProps }) => {
  return (
    <Flex
      border={!dashed ? "1px solid #ccc" : "1px dashed #ccc"}
      borderRadius="8px"
      backgroundColor={!dashed ? "#f7f7f8" : null}
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

export const formatDuration = duration => {
  const pluralize = (value, oneUnit, moreUnit) =>
    value === 1 ? `${value} ${oneUnit}` : `${value} ${moreUnit}`
  const timespans = duration
    .shiftTo("months", "days", "hours", "minutes")
    .toObject()
  if (timespans.months) {
    return pluralize(round(timespans.months), "month ago", "months ago")
  }
  if (timespans.days) {
    return pluralize(round(timespans.days), "day ago", "days ago")
  }
  if (timespans.hours) {
    return pluralize(round(timespans.hours), "hour ago", "hours ago")
  }
  return pluralize(round(timespans.seconds), "second ago", "seconds ago")
}
