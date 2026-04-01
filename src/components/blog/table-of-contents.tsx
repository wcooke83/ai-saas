interface TocItem { id: string; label: string; }

export function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <nav aria-label="Table of contents" className="bg-secondary-50 dark:bg-secondary-800/40 border border-secondary-200 dark:border-secondary-700 rounded-xl p-5 mb-10">
      <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-3">In this article</p>
      <ol className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
