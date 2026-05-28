import { whatsappUrl } from '@/lib/utils'
import SchemaOrg from '@/components/public/SchemaOrg'
import AnimatedNav from '@/components/animations/AnimatedNav'
import CustomCursor from '@/components/motion/CustomCursor'
import FloatingWhatsApp from '@/components/animations/FloatingWhatsApp'
import Link from 'next/link'

const WA = whatsappUrl()

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg type="organization" />
      <CustomCursor />
      <AnimatedNav />
      <FloatingWhatsApp />
      <main>{children}</main>

      {/* FOOTER */}
      <footer style={{ background: '#002438' }} className="text-white/60 py-14 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
          <div>
            <div className="font-display font-extrabold text-2xl text-white mb-1">LINHA RETA</div>
            <div className="text-lr-ocean text-xs font-semibold tracking-[0.3em] mb-4">TURISMO</div>
            <p className="text-sm max-w-xs">Do sonho ao destino, sem desvio.</p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <div className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Destinos</div>
              <div className="space-y-2">
                <Link href="/destinos?categoria=nordeste"      className="block hover:text-white transition-colors">Nordeste</Link>
                <Link href="/destinos?categoria=nacional"      className="block hover:text-white transition-colors">Brasil</Link>
                <Link href="/destinos?categoria=internacional" className="block hover:text-white transition-colors">Internacional</Link>
              </div>
            </div>
            <div>
              <div className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Links</div>
              <div className="space-y-2">
                <Link href="/blog"        className="block hover:text-white transition-colors">Blog</Link>
                <Link href="/captura"     className="block hover:text-white transition-colors">Ofertas exclusivas</Link>
                <Link href="/privacidade" className="block hover:text-white transition-colors">Privacidade</Link>
              </div>
            </div>
          </div>

          <div className="text-sm">
            <div className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Contato</div>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.472A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.003-1.37l-.358-.214-3.713.955.972-3.606-.233-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
              +55 81 9121-8178
            </a>
            <div className="text-xs text-white/30 mt-6">
              © {new Date().getFullYear()} Linha Reta Turismo.<br />Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
