import React, { Fragment } from "react"
import { storiesOf } from "@storybook/react"
import { Box, ThemeProvider } from "fannypack"
import FormEditor from "../components/FormEditor"
import { buildModel, buildFlatModel } from "../helpers/builder"
import { object, array, string, integer, number } from "../helpers/model"

const stories = storiesOf("components/builder", module)

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

stories.add("flat fieldsets", () => {
  const formPrefs = createFormPrefs()
  const formModel = buildFlatModel(orderSchema)
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

stories.add("nested fieldsets", () => {
  const formPrefs = createFormPrefs()
  const formModel = buildModel(orderSchema)
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

const parentColumns = "repeat(2, 1fr)"
const fullColumn = "1 / span 2"
const halfColumn = "span 1"
const leftColumn = "1 / span 1"
const rightColumn = "2 / span 1"

const createFormPrefs = () => {
  const headerStyle = {
    header: {
      color: "#ffffff",
      backgroundColor: "#002245",
    },
  }
  const bodyStyle = {
    body: {
      backgroundColor: "#fbd9d2",
    },
  }
  const editStyle = {
    header: {
      backgroundColor: "#fbd9d2",
    },
    body: {
      backgroundColor: "#fbd9d2",
    },
  }
  const formPrefs = {
    options: {
      // fontSizesHeader: ["36px", "30px", "24px", "20px"],
    },
    "#/": {
      // ...headerStyle,
    },
    "#/properties/customer": {
      gridTemplateColumns: parentColumns,
      // ...editStyle,
    },
    "#/properties/customer/properties/customerNumber": {
      gridColumn: halfColumn,
    },
    "#/properties/customer/properties/firstName": {
      gridColumn: leftColumn,
    },
    "#/properties/customer/properties/lastName": {
      gridColumn: halfColumn,
    },
    "#/properties/orderItems": {
      // ...headerStyle,
    },
    "#/properties/orderItems/items": {
      gridTemplateColumns: parentColumns,
      // ...headerStyle,
    },
    "#/properties/shippingAddress": {
      gridTemplateColumns: parentColumns,
      // ...headerStyle,
    },
  }
  return formPrefs
}

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
