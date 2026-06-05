import { Link } from "react-router-dom";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { useAuth } from "@/contexts/AuthContext";
import { useBackendStatus } from "@/contexts/BackendStatusContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wallets", label: "Wallets" },
  { href: "/strategies", label: "Strategies" },
  { href: "/notifications", label: "Notifications" },
];

export function Navbar() {
  const { user, isAuthenticated, signIn, signOut } = useAuth();
  const { status } = useBackendStatus();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-xl font-bold text-primary">
            VaultScout
          </Link>
          <nav className="hidden gap-6 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {status && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              API v{status.version}
            </Badge>
          )}
          <ConnectWalletButton />
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          ) : (
            <Button size="sm" onClick={() => void signIn()}>
              Sign in (SIWE)
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
