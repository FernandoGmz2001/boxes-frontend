import type { Cell, CellValue, DataValidation, Row, Workbook, Worksheet } from 'exceljs'
import { getCategories } from '@/features/categories/services/endpoints.ts'
import type { IGetCategory } from '@/features/categories/interfaces/get.interface.ts'

const PRODUCTS_SHEET = 'productos'
const CATEGORIES_SHEET = 'categorias'
const INSTRUCTIONS_SHEET = 'instrucciones'
const MAX_IMPORT_ROWS = 500
const SPREADSHEET_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const TRUE_TOKENS = new Set(['true', 'si', 'sí', 'verdadero', '1', 'yes'])
const FALSE_TOKENS = new Set(['false', 'no', 'falso', '0'])

interface CategoryChoice {
  id: number
  nombre: string
  label: string
}

interface SheetColumns {
  service: number
  active?: number
  category: number
}

interface SheetWithValidations {
  dataValidations: {
    add: (address: string, validation: DataValidation) => void
  }
}

export async function listImportCategories() {
  const firstPage = await getCategories({ pagina: 1, limite: 100 })
  if (firstPage.total_paginas <= 1) return firstPage.data

  const nextPages = await Promise.all(
    Array.from({ length: firstPage.total_paginas - 1 }, (_, index) =>
      getCategories({ pagina: index + 2, limite: 100 }),
    ),
  )

  return [firstPage.data, ...nextPages.map((page) => page.data)].flat()
}

export async function withFriendlyProductTemplate(template: Blob, categories: IGetCategory[]) {
  const workbook = await readWorkbook(await template.arrayBuffer())
  const sheet = requireProductSheet(workbook)
  const columns = requireColumns(sheet)
  const choices = categoryChoices(categories)

  writeCategoryList(workbook, choices)
  applyListValidation(sheet, columns.service, 'categorias!$D$2:$D$3', {
    allowBlank: true,
    promptTitle: 'Es servicio',
    prompt: 'Elige sí o no. Si lo dejas vacío, se toma como no.',
    errorTitle: 'Es servicio',
    error: 'Elige sí o no.',
  })

  if (columns.active) {
    applyListValidation(sheet, columns.active, 'categorias!$D$2:$D$3', {
      allowBlank: true,
      promptTitle: 'Activo',
      prompt: 'Elige sí o no. Si lo dejas vacío, el producto queda activo.',
      errorTitle: 'Activo',
      error: 'Elige sí o no.',
    })
  }

  if (choices.length > 0) {
    const lastRow = choices.length + 1
    sheet.getColumn(columns.category).numFmt = '@'
    applyListValidation(sheet, columns.category, `categorias!$A$2:$A$${lastRow}`, {
      allowBlank: true,
      promptTitle: 'Categoría',
      prompt: 'Elige el nombre de la categoría.',
      errorTitle: 'Categoría',
      error: 'Elige una categoría de la lista.',
    })
  }

  updateInstructions(workbook)
  return workbookFile(workbook, 'plantilla-productos.xlsx')
}

export async function toImportableProductFile(file: File, categories: IGetCategory[]) {
  const workbook = await readWorkbook(await file.arrayBuffer())
  const sheet = requireProductSheet(workbook)
  const columns = requireColumns(sheet)
  const choices = categoryChoices(categories)
  const errors: string[] = []
  let productRows = 0

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber)
    if (!rowHasValues(row, columns)) continue

    productRows += 1
    if (productRows > MAX_IMPORT_ROWS) {
      throw new Error(`El archivo no puede tener más de ${MAX_IMPORT_ROWS} productos.`)
    }

    const serviceError = writeServiceFlag(row.getCell(columns.service), rowNumber)
    if (serviceError) errors.push(serviceError)

    if (columns.active) {
      const activeError = writeActiveFlag(row.getCell(columns.active), rowNumber)
      if (activeError) errors.push(activeError)
    }

    const categoryError = writeCategoryId(row.getCell(columns.category), rowNumber, choices)
    if (categoryError) errors.push(categoryError)
  }

  if (productRows === 0) throw new Error('El archivo no tiene productos.')
  if (errors.length > 0) throw new Error(errors.join('\n'))

  return workbookFile(workbook, file.name)
}

async function createWorkbook() {
  await import('exceljs/dist/exceljs.bare.min.js')
  const excel = (globalThis as { ExcelJS?: { Workbook?: new () => Workbook } }).ExcelJS
  if (!excel?.Workbook) throw new Error('No se pudo leer el Excel. Usa la plantilla de productos.')
  return new excel.Workbook()
}

async function readWorkbook(data: ArrayBuffer) {
  const workbook = await createWorkbook()

  try {
    await workbook.xlsx.load(data as never)
  } catch {
    throw new Error('No se pudo leer el Excel. Usa la plantilla de productos.')
  }

  return workbook
}

function requireProductSheet(workbook: Workbook) {
  const sheet = findSheet(workbook, PRODUCTS_SHEET)
  if (!sheet) throw new Error('El archivo debe incluir la hoja productos.')
  return sheet
}

function requireColumns(sheet: Worksheet): SheetColumns {
  const header = sheet.getRow(1)
  let service: number | undefined
  let active: number | undefined
  let category: number | undefined
  const lastColumn = Math.max(sheet.columnCount, header.cellCount)

  for (let columnIndex = 1; columnIndex <= lastColumn; columnIndex += 1) {
    const name = cellText(header.getCell(columnIndex).value)?.toLocaleLowerCase('es-MX')
    if (name === 'es_servicio') service = columnIndex
    if (name === 'activo') active = columnIndex
    if (name === 'id_categoria') category = columnIndex
  }

  if (!service || !category) {
    throw new Error('La plantilla debe incluir las columnas es_servicio e id_categoria.')
  }

  return { service, active, category }
}

function writeCategoryList(workbook: Workbook, choices: CategoryChoice[]) {
  const existing = findSheet(workbook, CATEGORIES_SHEET)
  if (existing) workbook.removeWorksheet(existing.id)

  const sheet = workbook.addWorksheet(CATEGORIES_SHEET)
  sheet.state = 'hidden'
  sheet.getCell('A1').value = 'nombre'
  sheet.getCell('B1').value = 'id'
  sheet.getCell('D1').value = 'es_servicio'
  sheet.getCell('D2').value = 'sí'
  sheet.getCell('D3').value = 'no'
  choices.forEach((choice, index) => {
    const row = sheet.getRow(index + 2)
    row.getCell(1).value = choice.label
    row.getCell(2).value = choice.id
  })
}

function applyListValidation(
  sheet: Worksheet,
  columnIndex: number,
  formula: string,
  messages: Pick<DataValidation, 'allowBlank' | 'promptTitle' | 'prompt' | 'errorTitle' | 'error'>,
) {
  const letter = sheet.getColumn(columnIndex).letter
  const validations = (sheet as Worksheet & SheetWithValidations).dataValidations
  validations.add(`${letter}2:${letter}${MAX_IMPORT_ROWS + 1}`, {
    type: 'list',
    allowBlank: messages.allowBlank,
    formulae: [formula],
    showInputMessage: true,
    promptTitle: messages.promptTitle,
    prompt: messages.prompt,
    showErrorMessage: true,
    errorStyle: 'warning',
    errorTitle: messages.errorTitle,
    error: messages.error,
  })
}

function updateInstructions(workbook: Workbook) {
  const sheet = findSheet(workbook, INSTRUCTIONS_SHEET)
  if (!sheet) return

  sheet.eachRow((row) => {
    const column = cellText(row.getCell(1).value)
    if (column === 'es_servicio') {
      row.getCell(3).value = 'Elige sí o no. Si lo dejas vacío, se toma como no.'
    }
    if (column === 'activo') {
      row.getCell(3).value = 'Elige sí o no. Si lo dejas vacío, el producto queda activo.'
    }
    if (column === 'id_categoria') {
      row.getCell(3).value = 'Elige el nombre de la categoría, por ejemplo Empaques.'
    }
  })
}

function writeServiceFlag(cell: Cell, rowNumber: number) {
  const flag = readFlag(cell.value)
  if (flag === 'invalid') return `Fila ${rowNumber}: en es servicio escribe sí o no.`
  cell.value = flag ?? false
  cell.numFmt = 'General'
  return undefined
}

function writeActiveFlag(cell: Cell, rowNumber: number) {
  const flag = readFlag(cell.value)
  if (flag === 'invalid') return `Fila ${rowNumber}: en activo escribe sí o no.`
  if (flag === undefined) return undefined
  cell.value = flag
  cell.numFmt = 'General'
  return undefined
}

function writeCategoryId(cell: Cell, rowNumber: number, choices: CategoryChoice[]) {
  const value = cell.value
  const text = cellText(value)

  if (text === undefined && typeof value !== 'number') {
    return `Fila ${rowNumber}: elige una categoría.`
  }

  const categoryId = resolveCategoryId(value, choices)
  if (categoryId === 'ambiguous') {
    return `Fila ${rowNumber}: hay varias categorías llamadas "${text}". Elige la que incluye el id, por ejemplo Empaques (5).`
  }
  if (categoryId === undefined) {
    return `Fila ${rowNumber}: la categoría "${text ?? value}" no existe.`
  }

  cell.value = categoryId
  cell.numFmt = '0'
  return undefined
}

function readFlag(value: CellValue): boolean | undefined | 'invalid' {
  const text = cellText(value)
  if (text === undefined && typeof value !== 'number' && typeof value !== 'boolean') return undefined
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') {
    if (value === 1) return true
    if (value === 0) return false
    return 'invalid'
  }
  if (text === undefined) return undefined

  const token = normalizeToken(text)
  if (TRUE_TOKENS.has(token)) return true
  if (FALSE_TOKENS.has(token)) return false
  return 'invalid'
}

function resolveCategoryId(value: CellValue, choices: CategoryChoice[]) {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return choices.some((choice) => choice.id === value) ? value : undefined
  }

  const text = cellText(value)
  if (!text) return undefined

  const labeled = /^(.*)\((\d+)\)\s*$/.exec(text)
  if (labeled) {
    const id = Number(labeled[2])
    const name = normalizeToken(labeled[1] ?? '')
    const match = choices.find((choice) => choice.id === id)
    if (match && (name.length === 0 || normalizeToken(match.nombre) === name)) return id
  }

  if (/^\d+$/.test(text)) {
    const id = Number(text)
    return choices.some((choice) => choice.id === id) ? id : undefined
  }

  const name = normalizeToken(text)
  const matches = choices.filter((choice) => normalizeToken(choice.nombre) === name)
  if (matches.length > 1) return 'ambiguous' as const
  return matches[0]?.id
}

function categoryChoices(categories: IGetCategory[]): CategoryChoice[] {
  const counts = new Map<string, number>()
  for (const category of categories) {
    const key = normalizeToken(category.nombre)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return categories
    .map((category) => {
      const duplicated = (counts.get(normalizeToken(category.nombre)) ?? 0) > 1
      return {
        id: category.id,
        nombre: category.nombre,
        label: duplicated ? `${category.nombre} (${category.id})` : category.nombre,
      }
    })
    .sort((left, right) => left.label.localeCompare(right.label, 'es'))
}

function rowHasValues(row: Row, columns: SheetColumns) {
  const indexes = [columns.service, columns.category, columns.active].filter(
    (index): index is number => index !== undefined,
  )
  const lastColumn = Math.max(row.cellCount, ...indexes)

  for (let columnIndex = 1; columnIndex <= lastColumn; columnIndex += 1) {
    if (cellText(row.getCell(columnIndex).value) !== undefined) return true
  }

  return false
}

function cellText(value: CellValue): string | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'string') return blankToUndefined(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value instanceof Date) return undefined
  if (typeof value === 'object') {
    if ('richText' in value) return blankToUndefined(value.richText.map((part) => part.text).join(''))
    if ('text' in value && typeof value.text === 'string') return blankToUndefined(value.text)
    if ('result' in value) return cellText(value.result ?? null)
  }
  return undefined
}

function blankToUndefined(value: string) {
  const text = value.replace(/\u00a0/g, ' ').trim()
  return text.length > 0 ? text : undefined
}

function normalizeToken(value: string) {
  return value.replace(/\u00a0/g, ' ').trim().toLocaleLowerCase('es-MX').replace(/\s+/g, ' ')
}

function findSheet(workbook: Workbook, name: string) {
  return workbook.worksheets.find((sheet) => sheet.name.toLocaleLowerCase('es-MX') === name)
}

async function workbookFile(workbook: Workbook, fileName: string) {
  const output = await workbook.xlsx.writeBuffer()
  return new File([output], fileName, { type: SPREADSHEET_TYPE })
}
