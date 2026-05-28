// Sistema global de motion — tokens de animação
// Todos os componentes usam esses valores para consistência

export const EASE = {
  smooth:   [0.2, 0.7, 0.3, 1]  as const,
  bounce:   [0.34, 1.56, 0.64, 1] as const,
  sharp:    [0.4, 0, 0.2, 1]    as const,
  out:      [0, 0, 0.2, 1]      as const,
}

export const DURATION = {
  fast:   0.25,
  normal: 0.5,
  slow:   0.8,
  xslow:  1.2,
}

export const STAGGER = {
  tight:  0.04,
  normal: 0.08,
  loose:  0.15,
}

// Variants reutilizáveis
export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.smooth } },
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.normal, ease: EASE.smooth } },
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE.smooth } },
}

export const slideLeft = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE.smooth } },
}

export const staggerContainer = (stagger = STAGGER.normal, delay = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
})
