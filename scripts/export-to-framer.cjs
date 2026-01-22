#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

// Derive project root from script location (script is in scripts/, so go up one level)
const scriptDir = __dirname
const projectRoot = path.resolve(scriptDir, "..")

// Get component file path from command line
const componentPath = process.argv[2]

if (!componentPath) {
  console.error("Usage: npm run export <component-file>")
  console.error("Example: npm run export src/components/IPhoneVideoCard.tsx")
  process.exit(1)
}

// Resolve the component path:
// - Absolute paths: use as-is
// - Relative paths (./  ../): resolve from original working directory (INIT_CWD is set by npm)
// - Other paths (e.g., src/components/...): resolve from project root
const originalCwd = process.env.INIT_CWD || process.cwd()

let fullPath
if (path.isAbsolute(componentPath)) {
  fullPath = componentPath
} else if (componentPath.startsWith("./") || componentPath.startsWith("../")) {
  fullPath = path.resolve(originalCwd, componentPath)
} else {
  fullPath = path.resolve(projectRoot, componentPath)
}

if (!fs.existsSync(fullPath)) {
  console.error(`File not found: ${fullPath}`)
  process.exit(1)
}

const content = fs.readFileSync(fullPath, "utf-8")

// Extract component name
const componentNameMatch = content.match(/export function (\w+)/)
if (!componentNameMatch) {
  console.error("Could not find exported function component")
  process.exit(1)
}
const componentName = componentNameMatch[1]

// Extract props interface
const propsMatch = content.match(/interface (\w+Props)\s*\{([^}]+)\}/)
if (!propsMatch) {
  console.error("Could not find props interface")
  process.exit(1)
}

const propsInterfaceName = propsMatch[1]
const propsBody = propsMatch[2]

// Parse props
const propLines = propsBody.split("\n").filter(line => line.trim() && !line.trim().startsWith("//"))
const props = []

for (const line of propLines) {
  const propMatch = line.match(/(\w+)\??:\s*(.+?)(?:;|\s*$)/)
  if (propMatch) {
    const [, name, type] = propMatch
    props.push({ name: name.trim(), type: type.trim(), optional: line.includes("?:") })
  }
}

// Map TypeScript types to Framer ControlType
function getFramerControlType(propName, tsType) {
  const type = tsType.replace(/\s/g, "")

  // Check prop name hints
  if (propName.toLowerCase().includes("video")) {
    return { type: "ControlType.File", extra: 'allowedFileTypes: ["mp4", "webm", "mov"]' }
  }
  if (propName.toLowerCase().includes("image") || propName.toLowerCase().includes("frame") || propName.toLowerCase().includes("src")) {
    if (propName.toLowerCase().includes("video")) {
      return { type: "ControlType.File", extra: 'allowedFileTypes: ["mp4", "webm", "mov"]' }
    }
    return { type: "ControlType.Image" }
  }
  if (propName.toLowerCase().includes("color")) {
    return { type: "ControlType.Color" }
  }

  // Check type
  if (type === "string") {
    return { type: "ControlType.String" }
  }
  if (type === "number") {
    return { type: "ControlType.Number" }
  }
  if (type === "boolean") {
    return { type: "ControlType.Boolean" }
  }
  if (type.includes("|")) {
    // Enum type like "primary" | "secondary"
    const options = type.split("|").map(t => t.trim().replace(/['"]/g, ""))
    return { type: "ControlType.Enum", extra: `options: [${options.map(o => `"${o}"`).join(", ")}]` }
  }

  return { type: "ControlType.String" }
}

// Generate property controls
function generatePropertyControls(props) {
  const controls = props
    .filter(p => !["children", "style", "className"].includes(p.name))
    .map(prop => {
      const control = getFramerControlType(prop.name, prop.type)
      let entry = `  ${prop.name}: {\n    type: ${control.type},\n    title: "${formatTitle(prop.name)}"`
      if (control.extra) {
        entry += `,\n    ${control.extra}`
      }
      entry += ",\n  }"
      return entry
    })

  return `addPropertyControls(${componentName}, {\n${controls.join(",\n")}\n})`
}

function formatTitle(propName) {
  return propName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

// Process the component content for Framer
function processForFramer(content) {
  let processed = content

  // Remove local asset imports entirely (lines with ../assets or ./assets)
  processed = processed.replace(/^.*import.*from\s+["']\.\.?\/assets\/.*["'].*\n/gm, "")

  // Remove comments about local dev assets
  processed = processed.replace(/^\/\/\s*Local dev assets.*\n/gm, "")
  processed = processed.replace(/^\/\/\s*@ts-ignore.*\n/gm, "")

  // Remove default values that reference local imports in function params
  // Match pattern like: propName = localVariable,
  processed = processed.replace(/(\w+)\s*=\s*local\w+,/g, "$1,")
  processed = processed.replace(/(\w+)\s*=\s*local\w+\n/g, "$1\n")

  // Remove any existing addPropertyControls
  processed = processed.replace(/\/\/ Framer Property Controls[\s\S]*?addPropertyControls\([^)]+\)\s*\{[\s\S]*?\}\s*\)/g, "")
  processed = processed.replace(/import \{ addPropertyControls, ControlType \} from ["']framer["']\s*\n/g, "")

  // Clean up multiple empty lines
  processed = processed.replace(/\n{3,}/g, "\n\n")

  // Add Framer imports and controls
  const framerImport = 'import { addPropertyControls, ControlType } from "framer"'
  const propertyControls = generatePropertyControls(props)

  // Add after the first import line
  const firstImportEnd = processed.indexOf("\n", processed.indexOf("import "))
  processed = processed.slice(0, firstImportEnd + 1) + framerImport + "\n" + processed.slice(firstImportEnd + 1)

  // Add property controls at the end
  processed = processed.trim() + "\n\n" + propertyControls + "\n"

  return processed
}

// Create export directory in project root
const exportDir = path.join(projectRoot, "export")
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true })
}

// Process and write
const processedContent = processForFramer(content)
const outputPath = path.join(exportDir, `${componentName}.txt`)
fs.writeFileSync(outputPath, processedContent)

console.log(`✓ Exported ${componentName} to ${outputPath}`)
console.log(`\nGenerated controls for ${props.length} props:`)
props.forEach(p => console.log(`  - ${p.name}: ${p.type}`))
