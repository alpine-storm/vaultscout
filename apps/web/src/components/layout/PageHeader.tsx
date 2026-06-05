interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-10">
      {eyebrow && (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  );
}
