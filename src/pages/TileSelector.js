import React, { Fragment, useEffect, useState } from "react"
import { Box, Pane, Flex, Set, Heading, Text, Link } from "fannypack"
import useStoreon from "storeon/react"
import useReactRouter from "use-react-router"
import useLocalStorage from "react-use/lib/useLocalStorage"
import { round } from "lodash"
import { DateTime } from "luxon"
import "typeface-open-sans"
import "typeface-open-sans-condensed"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { faFileAlt } from "@fortawesome/free-regular-svg-icons"
import { FORMS_CREATE } from "../store/forms"
import { orderSchema, taskSchema } from "./FormDesigner"

export default ({ ...otherProps }) => {
  const { history, location, match } = useReactRouter()
  const { dispatch, forms } = useStoreon("forms")
  const currentVersion = 3
  const [version, setVersion] = useLocalStorage(
    "monomodel.version",
    currentVersion
  )
  const [tiles, setTiles] = useLocalStorage("monomodel.tiles", null)

  useEffect(() => {
    if (version !== currentVersion) {
      setVersion(currentVersion)
      setTiles([
        {
          id: 1,
          name: "orderSchema form",
          updatedAt: DateTime.local(2019, 4, 27, 12, 0, 0).toISO(),
          schema: orderSchema,
        },
        {
          id: 2,
          name: "taskSchema form",
          updatedAt: DateTime.local(2019, 4, 1, 12, 0, 0).toISO(),
          schema: taskSchema,
        },
      ])
    }
  }, [version])

  useEffect(() => {
    dispatch(FORMS_CREATE)
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
        <Heading use="h2">form selection</Heading>
        <Set isFilled spacing="major-3" marginTop="major-3">
          <Tile
            dashed
            cursor="pointer"
            onClick={() => {
              history.push({ pathname: "/form" })
            }}
          >
            <Link href={`#/form`}>
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
              const now = DateTime.local()
              const past = DateTime.fromISO(tile.updatedAt)
              const durationText = formatDuration(now.diff(past))
              return (
                <Tile
                  key={tile.name}
                  cursor="pointer"
                  onClick={() => {
                    history.push({ pathname: `/form/${tile.id}` })
                  }}
                >
                  <Flex column alignItems="center">
                    <Box marginBottom="minor-1">
                      <FontAwesomeIcon icon={faFileAlt} size="lg" />
                    </Box>
                    <Box marginTop="minor-1" marginBottom="minor-1">
                      <Link href={`#/form/${tile.id}`}>{tile.name}</Link>
                    </Box>
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
      width="calc(33.333% - 24px)"
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
  const pluralize = (value, singular, plural) =>
    value === 1 ? `${value} ${singular}` : `${value} ${plural}`
  const timeUnits = {
    months: ["month ago", "months ago"],
    days: ["day ago", "days ago"],
    hours: ["hour ago", "hours ago"],
    minutes: ["minute ago", "minutes ago"],
    seconds: ["second ago", "seconds ago"],
  }
  const timeSpans = duration.shiftTo(...Object.keys(timeUnits)).toObject()
  for (const timeUnit of Object.keys(timeUnits)) {
    if (timeSpans[timeUnit]) {
      return pluralize(round(timeSpans[timeUnit]), ...timeUnits[timeUnit])
    }
  }
  throw new Error("format duration could not find a matching time unit")
}
