import { Link } from '@tanstack/react-router'

export function Footer() {
  const footerLinks = {
    about: [
      { label: 'Giới thiệu', href: '/' },
      { label: 'Blog', href: '/' },
      { label: 'Tuyển dụng', href: '/' },
      { label: 'Liên hệ', href: '/' },
    ],
    support: [
      { label: 'Trung tâm trợ giúp', href: '/' },
      { label: 'An toàn mua bán', href: '/' },
      { label: 'Quy định đăng tin', href: '/' },
      { label: 'Quy chế hoạt động', href: '/' },
    ],
    follow: [
      { label: 'Facebook', href: '/' },
      { label: 'Instagram', href: '/' },
      { label: 'Youtube', href: '/' },
      { label: 'TikTok', href: '/' },
    ],
  }

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-semibold mb-4">Về chúng tôi</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Section */}
          <div>
            <h3 className="font-semibold mb-4">Theo dõi chúng tôi</h3>
            <ul className="space-y-2">
              {footerLinks.follow.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: support@Nart Tech.com</p>
              <p>Hotline: 1900-xxxx</p>
              <p className="mt-4" suppressHydrationWarning>
                © {new Date().getFullYear()} Nart Tech. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
