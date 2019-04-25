import React, { Fragment } from "react"
import { storiesOf } from "@storybook/react"
import { Box, ThemeProvider } from "fannypack"

import FormEditor from "../components/FormEditor"
import { buildModel } from "../library/builder"
import { object, array, string, integer, number } from "../library/model"

const stories = storiesOf("components/form", module)

stories.addDecorator(story => (
  <ThemeProvider>
    <Box
      backgroundColor="#f7f7f8"
      paddingLeft="major-5"
      paddingRight="major-5"
      paddingBottom="major-5"
    >
      {story()}
    </Box>
  </ThemeProvider>
))

const parentColumns = "repeat(2, 1fr)"
const fullColumn = "1 / span 2"
const halfColumn = "span 1"
const leftColumn = "1 / span 1"
const rightColumn = "2 / span 1"

stories.add("nested fieldsets", () => {
  const headerStyle = {
    // colorHeader: "white",
    // backgroundColorHeader: "#002245",
    // // backgroundColorHeader: "#f7f7f8",
  }
  const contentStyle = {
    // backgroundColorContent: "#fbd9d2",
  }
  const editStyle = {
    backgroundColorHeader: "#fbd9d2",
    backgroundColorContent: "#fbd9d2",
  }

  const formModel = buildModel(orderSchema)
  const formPrefs = {
    defaultActive: true,
    "#/": {
      ...headerStyle,
    },
    "#/properties/customer": {
      gridTemplateColumns: parentColumns,
      ...headerStyle,
      ...contentStyle,
      ...editStyle,
      active: true,
      // selected: true,
    },
    "#/properties/customer/properties/customerNumber": {
      gridColumn: halfColumn,
      active: true,
    },
    "#/properties/customer/properties/firstName": {
      gridColumn: leftColumn,
      active: true,
    },
    "#/properties/customer/properties/lastName": {
      gridColumn: halfColumn,
      active: true,
    },
    "#/properties/orderItems": {
      ...headerStyle,
    },
    "#/properties/orderItems/items": {
      gridTemplateColumns: parentColumns,
      ...headerStyle,
      ...contentStyle,
    },
    "#/properties/shippingAddress": {
      gridTemplateColumns: parentColumns,
      ...headerStyle,
      ...contentStyle,
    },
  }
  return (
    <Box
      marginLeft="major-4"
      marginRight="major-1"
      border="1px solid #cccccc"
      borderTop="none"
      backgroundColor="white"
    >
      <FormEditor model={formModel} prefs={formPrefs} />
    </Box>
  )
})

stories.add("flat fieldsets", () => {
  return <Box />
})

const orderSchema = object({
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
    orderItems: array({
      title: "items",
      items: object({
        title: "item",
        properties: {
          productNumber: string(),
          quantity: integer(),
          unitPrice: integer(),
        },
      }),
    }),
    shippingAddress: object({
      title: "address",
      properties: {
        street: string(),
        city: string(),
        country: string(),
        zip: string(),
      },
    }),
    totalPrice: number(),
  },
})

const jsonSchema = object({
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
