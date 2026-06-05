import { Link, NavLink } from "react-router-dom";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { useAuth } from "@/contexts/AuthContext";
import { useBackendStatus } from "@/contexts/BackendStatusContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radar } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wallets", label: "Wallets" },
  { href: "/strategies", label: "Strategies" },
  { href: "/notifications", label: "Notifications" },
];

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-secondary/70 text-foreground shadow-sm"
            : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
        )
      }
    >
      {label}
    </NavLink>
  );
}

export function Navbar() {
  const { user, isAuthenticated, signIn, signOut } = useAuth();
  const { status } = useBackendStatus();

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 shadow-glow-sm transition group-hover:border-primary/50">
              <Radar className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Vault<span className="text-primary">Scout</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavItem key={link.href} href={link.href} label={link.label} />
            ))}
            {user?.role === "ADMIN" && (
              <NavItem href="/admin" label="Admin" />
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          {status && (
            <Badge variant="outline" className="hidden border-border/60 sm:inline-flex">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-glow-sm" />
              v{status.version}
            </Badge>
          )}
          <ConnectWalletButton />
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign out
            </Button>
          ) : (
            <Button size="sm" onClick={() => void signIn()}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
