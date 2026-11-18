import { pathToRoot, resolveRelative, type FullSlug } from "../util/path"
import Darkmode from "./Darkmode"
// Darkmode is nested inside SiteNav, so it is not registered in the layout:
// bring its styles and inline script along explicitly.
import darkmodeStyles from "./styles/darkmode.scss"
// @ts-ignore: same as Darkmode.tsx — the inline file is not a module
import darkmodeScript from "./scripts/darkmode.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const SiteNav: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, cfg } = props
  const root = pathToRoot(fileData.slug!)
  const isHome = fileData.slug === "index"
  const DarkBtn = Darkmode()

  return (
    <nav class="sitenav">
      {!isHome && (
        <a class="sitenav-name" href={root}>
          {cfg?.pageTitle}
        </a>
      )}
      <div class="sitenav-links">
        <a href={root}>cv</a>
        <a href={resolveRelative(fileData.slug!, "blog" as FullSlug)}>blog</a>
        <DarkBtn {...props} />
      </div>
    </nav>
  )
}

SiteNav.beforeDOMLoaded = darkmodeScript
SiteNav.css =
  `
.sitenav {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.sitenav-name {
  font-size: 0.95rem;
  color: var(--dark);
  font-weight: 700;
}

.sitenav-links {
  display: flex;
  align-items: baseline;
  gap: 1.1rem;
  margin-left: auto;

  & a {
    font-size: 0.9rem;
    color: var(--darkgray);

    &:hover {
      color: var(--tertiary);
    }
  }
}

.sitenav .darkmode {
  margin: 0;
}

@media all and (max-width: 800px) {
  .sitenav {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .sitenav-links {
    margin-left: 0;
  }
}
` + darkmodeStyles

export default (() => SiteNav) satisfies QuartzComponentConstructor
