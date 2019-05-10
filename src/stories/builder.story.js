import React, { Fragment } from "react"
import { storiesOf } from "@storybook/react"
import { Box, Flex, Heading, ThemeProvider } from "fannypack"
import FormEditor from "../components/FormEditor"
import {
  buildModel,
  buildMetaModelNested,
  buildMetaModelFlat,
} from "../helpers/builder"
import {
  object,
  array,
  string,
  boolean,
  integer,
  number,
} from "../helpers/model"

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
  const formModel = buildMetaModelFlat(orderSchema)
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
  const formModel = buildMetaModelNested(orderSchema)
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

stories.add("meta model and model", () => {
  const formPrefs = createFormPrefs()
  const formMetaModel = buildMetaModelFlat(orderSchema)
  const formModel = buildModel(orderSchema, formMetaModel, {})

  return (
    <Box
      marginLeft="major-4"
      marginRight="major-1"
      border="1px solid #cccccc"
      borderTop="none"
      backgroundColor="white"
    >
      <Flex row>
        <Box flex="1">
          <Heading
            use="h2"
            fontFamily="open sans condensed"
            fontSize="26px"
            color="#121212"
            paddingLeft="major-2"
            paddingRight="major-2"
            paddingTop="major-2"
          >
            form meta-model
          </Heading>
          <FormEditor model={formMetaModel} prefs={formPrefs} />
        </Box>
        <Box flex="1">
          <Heading
            use="h2"
            fontFamily="open sans condensed"
            fontSize="26px"
            color="#121212"
            paddingLeft="major-2"
            paddingRight="major-2"
            paddingTop="major-2"
          >
            form model
          </Heading>
          <FormEditor model={formModel} prefs={formPrefs} />
        </Box>
      </Flex>
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

const schema1 = object({
  title: "Example Schema",
  properties: {
    firstName: string(),
    lastName: string(),
    age: integer({
      description: "Age in years",
      minimum: 0,
    }),
    dogs: array({
      items: string(),
      maxItems: 4,
    }),
    address: object({
      properties: {
        street: string(),
        city: string(),
        state: string(),
      },
      required: ["street", "city"],
    }),
    gender: string({
      enum: ["male", "female"],
    }),
    deceased: {
      enum: ["yes", "no", 1, 0, "true", "false"],
    },
  },
  required: ["firstName", "lastName"],
})

const schema2 = object({
  title: "MultipleObjects",
  id: "foo",
  oneOf: [
    { $ref: "#/definitions/ErrorResponse" },
    { $ref: "#/definitions/VersionGetResponse" },
  ],
  definitions: {
    ErrorResponse: object({
      title: "Error Response",
      id: "Error Response",
      properties: {
        message: string(),
        status: integer(),
      },
      required: ["message", "status"],
    }),
    VersionGetResponse: object({
      title: "Version Get Response",
      properties: {
        local: boolean(),
        version: string(),
      },
      required: ["version"],
    }),
  },
})
