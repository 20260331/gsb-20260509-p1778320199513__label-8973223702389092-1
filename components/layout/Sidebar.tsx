import Link from 'next/link'

interface SidebarItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface SidebarProps {
  items: SidebarItem[]
  className?: string
}

export default function Sidebar({ items, className = '' }: SidebarProps) {
  return (
    <aside className={`w-64 bg-white border-r min-h-screen ${className}`}>
      <nav className="p-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                {item.icon && <span className="mr-3">{item.icon}</span>}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
