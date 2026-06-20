'use client'
import { Drink } from '@/lib/types'

interface Props {
  drink: Drink
  className?: string
}

export default function DrinkLink({ drink, className = '' }: Props) {
  return (
    <a
      href={drink.wiki}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      className={`border-b border-dashed border-current/40 hover:border-current/80 transition-opacity hover:opacity-80 ${className}`}
    >
      {drink.drink}
    </a>
  )
}
