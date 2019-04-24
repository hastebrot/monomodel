import React, { Fragment } from "react"
import { storiesOf } from "@storybook/react"
import { Box, ThemeProvider } from "fannypack"

import { Form } from "../components/EditorForm"
import { buildModel } from "../tests/monomodel"
import { object, array, string, integer, number } from "../tests/fixture"

export const orderSchema = object({
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

const stories = storiesOf("lib/transform", module)

stories.addDecorator(story => (
  <ThemeProvider>
    <Box background="#f7f7f8">{story()}</Box>
  </ThemeProvider>
))

stories.add("insertion", () => {
  const headerStyle = {
    // colorHeader: "white",
    // backgroundColorHeader: "#002245",
    // // backgroundColorHeader: "#f7f7f8",
  }
  const contentStyle = {
    // backgroundColorContent: "#fbd9d2",
  }

  const parentColumns = "repeat(2, 1fr)"
  const fullColumn = "1 / span 2"
  const halfColumn = "span 1"
  const leftColumn = "1 / span 1"
  const rightColumn = "2 / span 1"

  const formModel = buildModel(orderSchema)
  const formPrefs = {
    "#/": {
      ...headerStyle,
    },
    "#/properties/customer": {
      gridTemplateColumns: parentColumns,
      ...headerStyle,
      ...contentStyle,
    },
    "#/properties/customer/properties/customerNumber": {
      gridColumn: halfColumn,
    },
    "#/properties/customer/properties/firstName": {
      gridColumn: halfColumn,
    },
    "#/properties/customer/properties/lastName": {
      gridColumn: halfColumn,
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
  return <Form model={formModel} prefs={formPrefs} />
})
