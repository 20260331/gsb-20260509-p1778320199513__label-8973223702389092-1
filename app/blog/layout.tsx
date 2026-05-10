export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="p-4 border-b bg-white">
        <span className="font-semibold">Blog</span>
      </nav>
      {children}
    </div>
  )
}
