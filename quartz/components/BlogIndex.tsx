import { resolveRelative } from "../util/path"
import { getDate } from "./Date"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const EXCLUDED_SLUGS = new Set(["index", "blog", "cv"])

const isoDate = (d: Date): string => d.toISOString().slice(0, 10)

const BlogIndex: QuartzComponent = ({ fileData, allFiles, cfg }: QuartzComponentProps) => {
  if (fileData.slug !== "blog") return null

  const posts = allFiles
    .filter(
      (file) =>
        file.slug &&
        !EXCLUDED_SLUGS.has(file.slug) &&
        !file.slug.startsWith("tags/") &&
        !file.slug.startsWith("private/"),
    )
    .sort((a, b) => {
      const da = getDate(cfg, a)?.getTime() ?? -Infinity
      const db = getDate(cfg, b)?.getTime() ?? -Infinity
      if (da !== db) return db - da
      return (a.frontmatter?.title ?? "").localeCompare(b.frontmatter?.title ?? "")
    })

  return (
    <ul class="blog-index">
      {posts.map((page) => {
        const title = page.frontmatter?.title ?? page.slug
        const date = getDate(cfg, page)
        return (
          <li key={page.slug}>
            <a class="internal" href={resolveRelative(fileData.slug!, page.slug!)}>
              {title}
            </a>
            {date && <time>{isoDate(date)}</time>}
          </li>
        )
      })}
    </ul>
  )
}

BlogIndex.css = `
.blog-index {
  list-style: none;
  padding: 0;
  margin: 1.4rem 0 0;

  & li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1.2rem;
    padding: 0.45rem 0;
  }

  & a {
    color: var(--darkgray);

    &:hover {
      color: var(--tertiary);
    }
  }

  & time {
    font-size: 0.82rem;
    color: var(--gray);
    white-space: nowrap;
  }
}
`

export default (() => BlogIndex) satisfies QuartzComponentConstructor
