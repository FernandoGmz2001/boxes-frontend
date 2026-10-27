import { formatMoney } from '@/features/products/format-money.ts'
import type { IVenta, IVentaCompleta, PaymentMethod } from './interfaces/sales/get.interface.ts'
import { formatDateTime } from './pos-dates.ts'
import { formatCents, toCents } from './pos-money.ts'

export interface SaleTicketLine {
  id: number
  nombre: string
  cantidad: number
  precio_unitario: string
  subtotal: string
}

export interface SaleTicketData {
  saleId: number
  folio: string
  created_at: string
  metodo_pago: PaymentMethod
  total: string
  cajero: string | null
  lines: SaleTicketLine[]
  cashReceivedCents: number | null
}

export function ticketFromCreatedSale(
  sale: IVenta,
  productNames: Map<number, string>,
  cashReceivedCents: number | null,
): SaleTicketData {
  return {
    saleId: sale.id,
    folio: sale.folio,
    created_at: sale.created_at,
    metodo_pago: sale.metodo_pago,
    total: sale.total,
    cajero: null,
    lines: sale.detalles.map((detail) => ({
      id: detail.id,
      nombre: productNames.get(detail.producto_id) ?? `Producto #${detail.producto_id}`,
      cantidad: detail.cantidad,
      precio_unitario: detail.precio_unitario,
      subtotal: detail.subtotal,
    })),
    cashReceivedCents: sale.metodo_pago === 'Efectivo' ? cashReceivedCents : null,
  }
}

export function ticketFromSaleDetail(sale: IVentaCompleta): SaleTicketData {
  return {
    saleId: sale.id,
    folio: sale.folio,
    created_at: sale.created_at,
    metodo_pago: sale.metodo_pago,
    total: sale.total,
    cajero: sale.usuario.nombre,
    lines: sale.detalles.map((detail) => ({
      id: detail.id,
      nombre: detail.nombre_producto,
      cantidad: detail.cantidad,
      precio_unitario: detail.precio_unitario,
      subtotal: detail.subtotal,
    })),
    cashReceivedCents: null,
  }
}

export function ticketChangeCents(ticket: SaleTicketData) {
  if (ticket.cashReceivedCents === null) return null
  return ticket.cashReceivedCents - toCents(ticket.total)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function ticketHtml(ticket: SaleTicketData) {
  const changeCents = ticketChangeCents(ticket)
  const rows = ticket.lines
    .map(
      (line) => `
        <tr><td colspan="2">${escapeHtml(line.nombre)}</td></tr>
        <tr><td>${line.cantidad} x ${formatMoney(line.precio_unitario)}</td><td class="r">${formatMoney(line.subtotal)}</td></tr>`,
    )
    .join('')
  const cashRows =
    ticket.cashReceivedCents !== null && changeCents !== null
      ? `<tr><td>Recibido</td><td class="r">${formatCents(ticket.cashReceivedCents)}</td></tr>
         <tr><td>Cambio</td><td class="r">${formatCents(Math.max(changeCents, 0))}</td></tr>`
      : ''

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${escapeHtml(ticket.folio)}</title>
    <style>
      body { font-family: ui-monospace, monospace; font-size: 12px; width: 72mm; margin: 0 auto; padding: 4mm 0; }
      h1 { font-size: 14px; text-align: center; margin: 0 0 4px; }
      p { margin: 0; text-align: center; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; }
      td { padding: 1px 0; vertical-align: top; }
      .r { text-align: right; }
      .total td { border-top: 1px dashed #000; font-weight: bold; padding-top: 4px; }
    </style></head><body>
    <h1>${escapeHtml(ticket.folio)}</h1>
    <p>${escapeHtml(formatDateTime(ticket.created_at))}</p>
    ${ticket.cajero ? `<p>Atendió: ${escapeHtml(ticket.cajero)}</p>` : ''}
    <table>${rows}
      <tr class="total"><td>Total</td><td class="r">${formatMoney(ticket.total)}</td></tr>
      <tr><td>Pago</td><td class="r">${escapeHtml(ticket.metodo_pago)}</td></tr>
      ${cashRows}
    </table>
    <p style="margin-top:8px">Gracias por su compra</p>
  </body></html>`
}

export function printTicket(ticket: SaleTicketData) {
  const frame = document.createElement('iframe')
  frame.setAttribute('aria-hidden', 'true')
  frame.style.position = 'fixed'
  frame.style.width = '0'
  frame.style.height = '0'
  frame.style.border = '0'
  frame.srcdoc = ticketHtml(ticket)
  frame.onload = () => {
    frame.contentWindow?.focus()
    frame.contentWindow?.print()
    window.setTimeout(() => frame.remove(), 1000)
  }
  document.body.appendChild(frame)
}
