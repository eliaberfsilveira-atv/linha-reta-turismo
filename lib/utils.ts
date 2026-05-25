import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formata preço em BRL
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value)
}

// Gera slug a partir de texto
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Calcula tempo de leitura estimado
export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / 200) // 200 palavras por minuto
}

// Formata data em português
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

// Monta URL do WhatsApp com mensagem
export function whatsappUrl(message?: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5581912181781'
  const text = encodeURIComponent(
    message || process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MSG || 'Olá! Vim pelo site e tenho interesse nos pacotes.'
  )
  return `https://wa.me/${number}?text=${text}`
}

// Desconto percentual
export function discountPercent(original: number, promotional: number): number {
  return Math.round(((original - promotional) / original) * 100)
}

// Trunca texto
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '…'
}

// Verifica se promoção está ativa
export function isPromotionActive(endDate: string | null): boolean {
  if (!endDate) return true
  return new Date(endDate) > new Date()
}
