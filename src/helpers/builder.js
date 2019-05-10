import ptr from "json-ptr"
import { schemaWalk } from "@cloudflare/json-schema-walker"
import graphlib, { Graph } from "graphlib"
import { get, set, pick, concat, cloneDeep } from "lodash"
import { fieldset, field } from "./model"
import { pretty1 } from "./utils"

// TODO(hastebrot): buildModel() + guestPointers

export const buildModel = (schema, metaModel, document) => {
  // console.log(ptr.flatten(schema))

  const listPointerSegments = (pointer, graph) => {
    let currentPointer = pointer
    const pointerSegments = []
    while (currentPointer) {
      const node = graph.node(currentPointer)
      const parentNode = graph.node(graph.parent(currentPointer))
      pointerSegments.unshift({
        segment: node.pointerSegment,
        parentType: parentNode ? parentNode.schema.type : null,
      })
      currentPointer = graph.parent(currentPointer)
    }
    return pointerSegments
  }

  const buildRegistry = graph => {
    const registry = {}
    for (const selfPointer of traverseSchemaGraph(graph)) {
      const parentPointer = graph.parent(selfPointer)
      const selfNode = graph.node(selfPointer)
      const parentNode = graph.node(parentPointer)
      registry[selfPointer] = {
        segment: selfNode.pointerSegment,
        type: parentNode ? parentNode.schema.type : null,
        parentPointer,
      }
    }
    return registry
  }

  const listParents = (pointer, registry) => {
    let currentPointer = pointer
    const parents = []
    while (currentPointer) {
      parents.unshift(currentPointer)
      currentPointer = registry[currentPointer]
        ? registry[currentPointer].parentPointer
        : null
    }
    return parents.map(pointer =>
      registry[pointer] ? registry[pointer].segment : null
    )
  }

  const pointer = "#/properties/orderItems/items/properties/productNumber"
  const graph = buildSchemaGraph(schema)
  console.log(writeSchemaGraph(graph))
  console.log(listPointerSegments(pointer, graph))

  const registry = buildRegistry(graph)
  console.log(listParents(pointer, registry))

  const rewriteSegments = (pointer, graph) => {
    const rewriteObjectSegment = pointerSegment => {
      return ptr.decodePointer(pointerSegment).slice(-1)[0]
    }
    const rewriteArraySegment = pointerSegment => {
      return "0"
    }

    const s = listPointerSegments(pointer, graph)
    const t = s.map(seg => {
      if (seg.parentType === "object") {
        return rewriteObjectSegment(seg.segment)
      }
      if (seg.parentType === "array") {
        return rewriteArraySegment(seg.segment)
      }
      return null
    })
    const path = ptr.encodePointer(t.slice(1))
    return path ? "#" + path : "#/"
  }

  const model = cloneDeep(metaModel)

  for (const fieldset of model.children) {
    fieldset.docPointer = rewriteSegments(fieldset.pointer, graph)
    if (fieldset.children) {
      for (const field of fieldset.children) {
        field.docPointer = rewriteSegments(field.pointer, graph)
      }
    }
  }

  model.children.splice(3, 0, {
    type: "context",
    title: "context start: repeatable fieldsets",
  })
  model.children.splice(5, 0, {
    type: "context",
    title: "context end: repeatable fieldsets",
  })

  return model

  // const model = []
  // const context = {}
  // const lastIndex = metaModel.length - 1
  // let index = 0
  // while (index <= lastIndex) {
  //   const e = metaModel[index]
  //   const p = e.self.p
  //   const t = e.self.t
  //   if (e.parent && e.parent.p in context) {
  //     const lastSubIndex = context[e.parent.p].size - 1
  //     let subIndex = 0
  //     while (subIndex <= lastSubIndex) {
  //       context.indices = [subIndex]
  //       const q = resolutions[p](context)
  //       const v = ptr.get(document, q)
  //       model.push({ p, q, t })
  //       subIndex += 1
  //     }
  //   } else {
  //     const q = resolutions[p](context)
  //     const v = ptr.get(document, q)
  //     model.push({ p, q, t })
  //     if (t === "array") {
  //       context[p] = { size: v.length }
  //     }
  //   }
  //   index += 1
  // }
}

/**
 * Builds a flat meta model using a json schema.
 */
export const buildMetaModelFlat = schema => {
  const registry = {
    fieldsetIndex: -1,
    fieldIndex: -1,
    currentParentPointer: null,
  }
  const model = fieldset("array")
  traverseSchema(schema, (object, parentObject) => {
    const pointer = toPointer(concat(parentObject.path, object.path))
    const parentPointer = toPointer(parentObject.path)
    const type = object.schema.type

    if (
      !isFieldsetType(type) &&
      parentPointer !== registry.currentParentPointer
    ) {
      registry.fieldsetIndex += 1
      registry.fieldIndex = -1
      registry.currentParentPointer = parentPointer

      const objectPathSegments = []
      objectPathSegments.push(`children[${registry.fieldsetIndex}]`)
      const objectPath = toObjectPath(concat(...objectPathSegments))
      // console.log(pretty1([objectPath, parentPointer]))

      const payload = pick(parentObject.schema, ["title", "description"])
      const node = fieldset(parentObject.schema.type, {
        pointer: parentPointer,
        ...payload,
      })
      set(model, objectPath, node)
    }

    if (isFieldsetType(type)) {
      registry.fieldsetIndex += 1
      registry.fieldIndex = -1
      registry.currentParentPointer = pointer
    } else {
      registry.fieldIndex += 1
    }

    const objectPathSegments = []
    objectPathSegments.push(`children[${registry.fieldsetIndex}]`)
    if (!isFieldsetType(type)) {
      objectPathSegments.push(`children[${registry.fieldIndex}]`)
    }
    const objectPath = toObjectPath(concat(...objectPathSegments))
    // console.log(pretty1([objectPath, pointer]))

    if (isFieldsetType(type)) {
      const payload = pick(object.schema, ["title", "description"])
      const node = fieldset(type, { pointer, ...payload })
      set(model, objectPath, node)
    } else {
      const payload = pick(object.schema, ["title", "description"])
      const node = field(type, { pointer, ...payload })
      set(model, objectPath, node)
    }
  })
  return model
}

/**
 * Builds a nested meta model using a json schema.
 */
export const buildMetaModelNested = schema => {
  const registry = {}
  const model = {}
  traverseSchema(schema, (object, parentObject) => {
    const pointer = toPointer(concat(parentObject.path, object.path))
    const parentPointer = toPointer(parentObject.path)
    const type = object.schema.type

    if (isRootPointer(pointer, parentPointer)) {
      registry[pointer] = {
        parentPointer: null,
        path: null,
        index: 0,
        nextChildIndex: 0,
      }
    } else {
      registry[pointer] = {
        parentPointer,
        path: object.path,
        index: registry[parentPointer].nextChildIndex,
        nextChildIndex: 0,
      }
      registry[parentPointer].nextChildIndex += 1
    }

    const rewritePathSegment = ({ path, index }) => {
      // return path || []
      return path ? ["children", index] : []
    }

    const objectPathSegments = []
    let currentEntry = registry[pointer]
    while (currentEntry) {
      objectPathSegments.unshift(rewritePathSegment(currentEntry))
      currentEntry = registry[currentEntry.parentPointer]
    }
    const objectPath = toObjectPath(concat(...objectPathSegments))
    const rootObjectPath = objectPath ? "root." + objectPath : "root"
    // console.log(pretty1([objectPath, pointer]))

    if (isFieldsetType(type)) {
      const payload = pick(object.schema, ["title", "description"])
      const node = fieldset(type, { pointer, ...payload })
      set(model, rootObjectPath, node)
    } else {
      const payload = pick(object.schema, ["title", "description"])
      const node = field(type, { pointer, ...payload })
      set(model, rootObjectPath, node)
    }
  })
  return model.root
}

export const isFieldsetType = type => {
  return type === "object" || type === "array"
}

export const isRootPointer = (pointer, parentPointer) => {
  return pointer === parentPointer
}

export const toPointer = pathSegments => {
  return `#/${pathSegments.join("/")}`
}

export const toObjectPath = pathSegments => {
  return pathSegments.join(".")
}

export const traverseSchema = (schema, visitFn) => {
  schemaWalk(schema, (schemaObject, path, parentSchemaObject, parentPath) => {
    const object = { schema: schemaObject, path: path }
    const parentObject = { schema: parentSchemaObject, path: parentPath }
    visitFn(object, parentObject)
  })
}

const ROOT_POINTER = "#/"

export const buildSchemaGraph = schema => {
  const isRootPointer = pointer => {
    return pointer === ROOT_POINTER
  }
  const withRoot = pointer => (pointer ? "#" + pointer : ROOT_POINTER)
  const graph = new Graph({ directed: true, compound: true })
  schemaWalk(schema, (selfSchema, selfPath, parentSchema, parentPath) => {
    const schema = selfSchema
    const pointer = withRoot(ptr.encodePointer(concat(parentPath, selfPath)))
    const parentPointer = withRoot(ptr.encodePointer(concat(parentPath)))
    const pointerSegment = ptr.encodePointer(selfPath)
    graph.setNode(pointer, {
      schema,
      pointer,
      pointerSegment,
    })
    if (!(isRootPointer(parentPointer) && isRootPointer(pointer))) {
      graph.setEdge(parentPointer, pointer)
    }
    if (!isRootPointer(pointer)) {
      graph.setParent(pointer, parentPointer)
    }
  })
  return graph
}

export const traverseSchemaGraph = (graph, root = ROOT_POINTER) =>
  graphlib.alg.preorder(graph, root)

export const readSchemaGraph = json => graphlib.json.read(json)
export const writeSchemaGraph = graph => graphlib.json.write(graph)
