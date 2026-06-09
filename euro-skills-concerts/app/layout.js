import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "EuroSkills Concerts",
  description: "Concert reservation SPA"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="app-header">
          <Link className="brand" href="/">
            EuroSkills Concerts
          </Link>
          <div className="ticket-entry">
            <span>Already booked?</span>
            <Link className="button button-light" href="/tickets">
              Get Tickets
            </Link>
          </div>
        </header>
        <main className="page-shell">{children}</main>
      </body>
    </html>
  );
}
