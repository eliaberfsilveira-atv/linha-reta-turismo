export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #003A5D 0%, #001829 100%)' }}>
      {children}
    </div>
  )
}
