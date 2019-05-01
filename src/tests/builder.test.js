import ptr from "json-ptr"
import {
  buildModel,
  buildMetaModelNested,
  buildMetaModelFlat,
  toPointer,
  toObjectPath,
  traverseSchema,
  buildSchemaGraph,
  traverseSchemaGraph,
  writeSchemaGraph,
} from "../helpers/builder"
import {
  object,
  array,
  string,
  number,
  integer,
  fieldset,
  field,
} from "../helpers/model"
import { pretty, pretty1 } from "../helpers/utils"

describe.only("builder model", () => {
  test.only("form assembler", () => {
    const metaModel = [
      {
        title: "order",
        self: { p: "#/", t: "object" },
        parent: null,
      },
      {
        title: "customer",
        self: { p: "#/properties/customer", t: "object" },
        parent: { p: "#/", t: "object" },
      },
      {
        title: "items",
        self: { p: "#/properties/orderItems", t: "array" },
        parent: { p: "#/", t: "object" },
      },
      {
        title: "item",
        self: { p: "#/properties/orderItems/items", t: "object" },
        parent: { p: "#/properties/orderItems", t: "array" },
      },
    ]

    const toIndex = (pos, context) =>
      context && context.indices ? context.indices[pos] : 0
    const resolutions = {
      "#/": context => `#/`,
      "#/properties/customer": context => `#/customer`,
      "#/properties/orderItems": context => `#/orderItems`,
      "#/properties/orderItems/items": context =>
        `#/orderItems/${toIndex(0, context)}`,
    }

    const document = {
      orderNumber: "1234AA",
      customer: {
        customerNumber: "C124",
      },
      orderItems: [
        { productNumber: "B00ABA0ZOA", quantity: 1 },
        { productNumber: "9780099477464", quantity: 1 },
      ],
    }

    const model = []
    const context = {}
    const lastIndex = metaModel.length - 1
    let index = 0
    while (index <= lastIndex) {
      const e = metaModel[index]
      const p = e.self.p
      const t = e.self.t
      if (e.parent && e.parent.p in context) {
        const lastSubIndex = context[e.parent.p].size - 1
        let subIndex = 0
        while (subIndex <= lastSubIndex) {
          context.indices = [subIndex]
          const q = resolutions[p](context)
          const v = ptr.get(document, q)
          model.push({ p, q, t })
          subIndex += 1
        }
      } else {
        const q = resolutions[p](context)
        const v = ptr.get(document, q)
        model.push({ p, q, t })
        if (t === "array") {
          context[p] = { size: v.length }
        }
      }

      index += 1
    }
    console.log(pretty(model))
  })

  test("graph", () => {
    const schema = object({
      properties: {
        orderNumber: string(),
        customer: object({
          properties: {
            customerNumber: string(),
          },
        }),
        orderItems: array({
          items: object({
            properties: {
              productNumber: string(),
              quantity: integer(),
            },
          }),
        }),
      },
    })

    const metaModel = fieldset("array", {
      children: [
        fieldset("object", {
          pointer: "#/",
          children: [
            field("string", {
              pointer: "#/properties/orderNumber",
            }),
          ],
        }),
        fieldset("object", {
          pointer: "#/properties/customer",
          children: [
            field("string", {
              pointer: "#/properties/customer/properties/customerNumber",
            }),
          ],
        }),
        fieldset("array", {
          pointer: "#/properties/orderItems",
        }),
        fieldset("object", {
          pointer: "#/properties/orderItems/items",
          children: [
            field("string", {
              pointer: "#/properties/orderItems/items/properties/productNumber",
            }),
            field("integer", {
              pointer: "#/properties/orderItems/items/properties/quantity",
            }),
          ],
        }),
      ],
    })

    const document = {
      orderNumber: "1234AA",
      customer: {
        customerNumber: "C124",
      },
      orderItems: [
        { productNumber: "B00ABA0ZOA", quantity: 1 },
        { productNumber: "9780099477464", quantity: 1 },
      ],
    }

    // prepare schema graph
    // traverse meta model tree
    // fetch document values

    const graph = buildSchemaGraph(schema)
    // console.log(pretty(writeSchemaGraph(graph)))

    const rewriteObjectSegment = pointerSegment => {
      return ptr.decodePointer(pointerSegment).slice(-1)[0]
    }
    const rewriteArraySegment = pointerSegment => {
      return "[]"
    }

    const registry = {}
    for (const pointer of traverseSchemaGraph(graph)) {
      const parentPointer = graph.parent(pointer)
      const childNode = graph.node(pointer)
      const parentNode = graph.node(parentPointer)

      if (parentNode && parentNode.schema.type === "object") {
        const segment = rewriteObjectSegment(childNode.pointerSegment)
        registry[pointer] = { segment, parentPointer }
      }
      if (parentNode && parentNode.schema.type === "array") {
        const segment = rewriteArraySegment(childNode.pointerSegment)
        registry[pointer] = { segment, parentPointer }
      }
    }

    let currentPointer =
      "#/properties/orderItems/items/properties/productNumber"
    const parents = []
    while (currentPointer) {
      parents.unshift(currentPointer)
      currentPointer = registry[currentPointer]
        ? registry[currentPointer].parentPointer
        : null
    }
    // console.log(parents.map(pointer => registry[pointer] ? registry[pointer].segment : null))

    console.log(ptr.get(document, "/orderItems").length)
    console.log(ptr.get(document, "/orderItems/0/productNumber"))
    console.log(ptr.get(document, "/orderItems/0/quantity"))

    const model = []

    for (const fieldset of metaModel.children) {
      model.push(fieldset)
      // repeatable fieldset
      console.log(fieldset.pointer, registry[fieldset.pointer])
      if (fieldset.children) {
        for (const field of fieldset.children) {
          console.log(field.pointer, registry[field.pointer])
        }
      }
    }

    console.log(pretty(model))

    // console.log(pretty(registry))

    // const metaModel = buildMetaModelFlat(schema)
    // console.log(metaModel)
  })
  // test("schema 1", () => {
  //   // given:
  //   const schema = object({
  //     title: "order",
  //     properties: {
  //       orderNumber: string(),
  //       orderDate: string(),
  //     },
  //   })
  //   const model = fieldset("array", {
  //     children: [
  //       fieldset("object", {
  //         pointer: "#/",
  //         title: "order",
  //         children: [
  //           field("string", {
  //             pointer: "#/properties/orderNumber",
  //           }),
  //           field("string", {
  //             pointer: "#/properties/orderDate",
  //           }),
  //         ],
  //       }),
  //     ],
  //   })
  //   // expect:
  //   const metaModel = buildMetaModelFlat(schema)
  //   const data = {
  //     orderNumber: "123abc",
  //     orderDate: "2001-02-03"
  //   }
  //   expect(buildModel(schema, metaModel, data)).toEqual(model)
  // })
})

describe("builder meta model flat", () => {
  test("schema 1", () => {
    // given:
    const schema = object({
      title: "order",
    })
    const model = fieldset("array", {
      children: [
        fieldset("object", {
          pointer: "#/",
          title: "order",
        }),
      ],
    })
    // expect:
    expect(buildMetaModelFlat(schema)).toEqual(model)
  })

  test("schema 2", () => {
    // given:
    const schema = object({
      title: "order",
      properties: {
        orderNumber: string(),
        orderDate: string(),
      },
    })
    const model = fieldset("array", {
      children: [
        fieldset("object", {
          pointer: "#/",
          title: "order",
          children: [
            field("string", {
              pointer: "#/properties/orderNumber",
            }),
            field("string", {
              pointer: "#/properties/orderDate",
            }),
          ],
        }),
      ],
    })
    // expect:
    expect(buildMetaModelFlat(schema)).toEqual(model)
  })

  test("schema 3", () => {
    // given:
    const schema = object({
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
    const model = fieldset("array", {
      children: [
        fieldset("object", {
          pointer: "#/",
          title: "order",
          children: [
            field("string", {
              pointer: "#/properties/orderNumber",
            }),
            field("string", {
              pointer: "#/properties/orderDate",
            }),
          ],
        }),
        fieldset("object", {
          pointer: "#/properties/customer",
          title: "customer",
          children: [
            field("string", {
              pointer: "#/properties/customer/properties/customerNumber",
            }),
            field("string", {
              pointer: "#/properties/customer/properties/firstName",
            }),
            field("string", {
              pointer: "#/properties/customer/properties/lastName",
            }),
          ],
        }),
      ],
    })
    // expect:
    expect(buildMetaModelFlat(schema)).toEqual(model)
  })

  test("schema 4", () => {
    // given:
    const schema = object({
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
        totalPrice: number(),
      },
    })
    const model = fieldset("array", {
      children: [
        fieldset("object", {
          pointer: "#/",
          title: "order",
          children: [
            field("string", {
              pointer: "#/properties/orderNumber",
            }),
            field("string", {
              pointer: "#/properties/orderDate",
            }),
          ],
        }),
        fieldset("object", {
          pointer: "#/properties/customer",
          title: "customer",
          children: [
            field("string", {
              pointer: "#/properties/customer/properties/customerNumber",
            }),
            field("string", {
              pointer: "#/properties/customer/properties/firstName",
            }),
            field("string", {
              pointer: "#/properties/customer/properties/lastName",
            }),
          ],
        }),
        fieldset("array", {
          pointer: "#/properties/orderItems",
          title: "items",
        }),
        fieldset("object", {
          pointer: "#/properties/orderItems/items",
          title: "item",
          children: [
            field("string", {
              pointer: "#/properties/orderItems/items/properties/productNumber",
            }),
            field("integer", {
              pointer: "#/properties/orderItems/items/properties/quantity",
            }),
            field("integer", {
              pointer: "#/properties/orderItems/items/properties/unitPrice",
            }),
          ],
        }),
        fieldset("object", {
          pointer: "#/",
          title: "order",
          children: [
            field("number", {
              pointer: "#/properties/totalPrice",
            }),
          ],
        }),
      ],
    })
    // expect:
    expect(buildMetaModelFlat(schema)).toEqual(model)
  })
})

describe("builder meta model nested", () => {
  test("schema 1", () => {
    // given:
    const schema = object({
      title: "order",
    })
    const model = fieldset("object", {
      pointer: "#/",
      title: "order",
    })
    // expect:
    expect(buildMetaModelNested(schema)).toEqual(model)
  })

  test("schema 2", () => {
    // given:
    const schema = object({
      title: "order",
      properties: {
        orderNumber: string(),
        orderDate: string(),
      },
    })
    const model = fieldset("object", {
      pointer: "#/",
      title: "order",
      children: [
        field("string", {
          pointer: "#/properties/orderNumber",
        }),
        field("string", {
          pointer: "#/properties/orderDate",
        }),
      ],
    })
    // expect:
    expect(buildMetaModelNested(schema)).toEqual(model)
  })

  test("schema 3", () => {
    // given:
    const schema = object({
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
    const model = fieldset("object", {
      pointer: "#/",
      title: "order",
      children: [
        field("string", {
          pointer: "#/properties/orderNumber",
        }),
        field("string", {
          pointer: "#/properties/orderDate",
        }),
        fieldset("object", {
          pointer: "#/properties/customer",
          title: "customer",
          children: [
            field("string", {
              pointer: "#/properties/customer/properties/customerNumber",
            }),
            field("string", {
              pointer: "#/properties/customer/properties/firstName",
            }),
            field("string", {
              pointer: "#/properties/customer/properties/lastName",
            }),
          ],
        }),
      ],
    })
    // expect:
    expect(buildMetaModelNested(schema)).toEqual(model)
  })

  test("schema 4", () => {
    // given:
    const schema = object({
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
        totalPrice: number(),
      },
    })
    const model = fieldset("object", {
      pointer: "#/",
      title: "order",
      children: [
        field("string", {
          pointer: "#/properties/orderNumber",
        }),
        field("string", {
          pointer: "#/properties/orderDate",
        }),
        fieldset("object", {
          pointer: "#/properties/customer",
          title: "customer",
          children: [
            field("string", {
              pointer: "#/properties/customer/properties/customerNumber",
            }),
            field("string", {
              pointer: "#/properties/customer/properties/firstName",
            }),
            field("string", {
              pointer: "#/properties/customer/properties/lastName",
            }),
          ],
        }),
        fieldset("array", {
          pointer: "#/properties/orderItems",
          title: "items",
          children: [
            fieldset("object", {
              pointer: "#/properties/orderItems/items",
              title: "item",
              children: [
                field("string", {
                  pointer:
                    "#/properties/orderItems/items/properties/productNumber",
                }),
                field("integer", {
                  pointer: "#/properties/orderItems/items/properties/quantity",
                }),
                field("integer", {
                  pointer: "#/properties/orderItems/items/properties/unitPrice",
                }),
              ],
            }),
          ],
        }),
        field("number", {
          pointer: "#/properties/totalPrice",
        }),
      ],
    })
    // expect:
    expect(buildMetaModelNested(schema)).toEqual(model)
  })
})
