'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5581912181781'
const WA_MSG    = encodeURIComponent('Olá! Vim pelo site e tenho interesse nos pacotes.')
const WA_URL    = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)
  const [pulsing, setPulsing] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 3000)
    const t2 = setTimeout(() => setPulsing(true), 8000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute right-16 bottom-2 bg-white text-lr-navy text-xs font-bold px-3 py-2 rounded-xl shadow-lg whitespace-nowrap pointer-events-none"
            style={{ border: '1px solid rgba(0,58,93,0.08)' }}
          >
            Fale conosco agora!
            <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rotate-45"
              style={{ border: '1px solid rgba(0,58,93,0.08)', borderLeft: 'none', borderBottom: 'none' }} />
          </motion.div>

          {/* Pulse rings */}
          {pulsing && (
            <>
              <motion.div className="absolute inset-0 rounded-full bg-green-400"
                animate={{ scale: [1, 1.9], opacity: [0.4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }} />
              <motion.div className="absolute inset-0 rounded-full bg-green-400"
                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.4 }} />
            </>
          )}

          {/* Button */}
          <motion.a
            href={WA_URL} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
            className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl"
            style={{ background: '#25D366' }}
            aria-label="Falar no WhatsApp"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.472A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.003-1.37l-.358-.214-3.713.955.972-3.606-.233-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
            </svg>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
