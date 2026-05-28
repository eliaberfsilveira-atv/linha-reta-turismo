// Logo SVG da Linha Reta Turismo — baseado no símbolo oficial (versão 2 simplificada)
// Uso: <Logo size={40} variant="light" /> ou <Logo size={40} variant="dark" />

type Props = {
  size?: number
  variant?: 'light' | 'dark'  // light = branco (para fundos escuros), dark = navy (para fundos claros)
  className?: string
}

export default function Logo({ size = 40, variant = 'light', className = '' }: Props) {
  const navy  = variant === 'light' ? '#FFFFFF' : '#003A5D'
  const ocean = '#00A7D8'
  const sun   = '#FFC247'
  const green = '#2E8B57'
  const white = variant === 'light' ? '#FFFFFF' : '#FFFFFF'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Linha Reta Turismo"
    >
      {/* Círculo borda */}
      <circle cx="50" cy="50" r="47" stroke={navy} strokeWidth="4" fill="none" opacity={variant === 'light' ? '0.6' : '1'} />

      {/* Onda oceano principal */}
      <path
        d="M6 64 Q20 54 35 62 Q50 70 65 60 Q78 52 94 58 L94 80 Q78 74 65 82 Q50 90 35 82 Q20 74 6 80 Z"
        fill={ocean}
      />

      {/* Onda mais clara (segunda) */}
      <path
        d="M6 72 Q20 64 35 70 Q50 76 65 68 Q78 60 94 66 L94 84 Q78 78 65 86 Q50 94 35 86 Q20 78 6 84 Z"
        fill={ocean}
        opacity="0.4"
      />

      {/* Sol dourado nascendo da onda */}
      <circle cx="50" cy="66" r="11" fill={sun} />
      {/* Máscara para cortar a metade de baixo do sol (efeito nascendo) */}
      <path d="M38 66 Q50 54 62 66 L62 80 Q50 80 38 80 Z" fill={ocean} />

      {/* Palmeira */}
      <line x1="32" y1="70" x2="29" y2="44" stroke={green} strokeWidth="2.5" strokeLinecap="round" />
      {/* Folhas da palmeira */}
      <path d="M29 44 Q22 36 16 38 Q22 42 26 47" fill={green} />
      <path d="M29 44 Q24 34 28 28 Q30 36 32 41" fill={green} />
      <path d="M29 44 Q36 36 40 38 Q34 42 30 47" fill={green} />

      {/* Avião — corpo */}
      <g transform="translate(55, 28) rotate(-28)">
        {/* Fuselagem */}
        <ellipse cx="0" cy="0" rx="13" ry="4" fill={navy} opacity={variant === 'light' ? '0.9' : '1'} />
        {/* Asa principal */}
        <path d="M-2 1 L-9 10 L7 6 Z" fill={navy} opacity={variant === 'light' ? '0.8' : '0.9'} />
        {/* Cauda */}
        <path d="M-9 0 L-14 5 L-5 3 Z" fill={navy} opacity={variant === 'light' ? '0.8' : '0.9'} />
        {/* Janelas */}
        <circle cx="2" cy="-1" r="1.3" fill={ocean} />
        <circle cx="5.5" cy="-1" r="1.3" fill={ocean} />
        <circle cx="-1.5" cy="-1" r="1.3" fill={ocean} />
      </g>

      {/* Esteira do avião */}
      <path
        d="M74 20 Q62 36 50 50"
        stroke={ocean}
        strokeWidth="1.8"
        fill="none"
        strokeDasharray="3 3"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}
