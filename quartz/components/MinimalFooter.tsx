import { joinSegments, pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const MinimalFooter: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
  const root = pathToRoot(fileData.slug!)
  return (
    <footer class="minimal-footer">
      <span class="minimal-footer-copy">
        © {new Date().getFullYear()} {cfg?.pageTitle}
      </span>
      <div class="minimal-footer-links">
        <a href="https://www.linkedin.com/in/shouki/" rel="noopener">
          linkedin
        </a>
        <a href={joinSegments(root, "index.xml")}>rss</a>
      </div>
    </footer>
  )
}

MinimalFooter.css = `
.minimal-footer {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin: 4.5rem 0 0;

  & .minimal-footer-copy {
    font-size: 0.82rem;
    color: var(--gray);
  }

  & .minimal-footer-links {
    display: flex;
    gap: 1.1rem;

    & a {
      font-size: 0.85rem;
      color: var(--darkgray);

      &:hover {
        color: var(--tertiary);
      }
    }
  }
}
`

export default (() => MinimalFooter) satisfies QuartzComponentConstructor
