import React, { Fragment, useEffect, useState } from "react"
import { Box } from "fannypack"
import useReactRouter from "use-react-router"
import useLocalStorage from "react-use/lib/useLocalStorage"
import FormEditor from "../components/FormEditor"
import { buildMetaModelNested, buildMetaModelFlat } from "../helpers/builder"
import {
  object,
  array,
  string,
  boolean,
  integer,
  number,
} from "../helpers/model"
import { pretty } from "../helpers/utils"

export default ({ nested = false, ...otherProps }) => {
  const { history, location, match } = useReactRouter()
  const [localForms, setLocalForms] = useLocalStorage("monomodel.forms", null)

  const [formModel, setFormModel] = useState(null)
  const formPrefs = createFormPrefs()
  useEffect(() => {
    if (localForms) {
      const form = localForms.find(form => String(form.id) === match.params.formId)
      const formModel = nested
        ? buildMetaModelNested(form.schema)
        : buildMetaModelFlat(form.schema)
      setFormModel(formModel)
    }
  }, [localForms])

  return (
    <Box
      backgroundColor="#f7f7f8"
      paddingLeft="major-5"
      paddingRight="major-5"
      paddingBottom="major-5"
      height="100vh"
      {...otherProps}
    >
      <Box
        border="1px solid #cccccc"
        borderTop="none"
        backgroundColor="white"
        maxWidth="1080px"
        margin="0 auto"
      >
        {formModel && <FormEditor model={formModel} prefs={formPrefs} />}
      </Box>
    </Box>
  )
}

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

export const taskSchema = object({
  title: "A list of tasks",
  required: ["title"],
  properties: {
    title: string({
      title: "Task list title",
    }),
    tasks: array({
      title: "Tasks",
      items: object({
        title: "Task",
        required: ["title"],
        properties: {
          title: string({
            title: "Title",
            description: "A sample title",
          }),
          details: string({
            title: "Task details",
            description: "Enter the task details",
          }),
          done: boolean({
            title: "Done?",
            default: false,
          }),
        },
      }),
    }),
  },
})
