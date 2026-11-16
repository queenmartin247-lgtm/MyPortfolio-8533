import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Move,
  Grid2X2,
  Sprout,
  Pencil,
  Download,
  Upload,
  Check,
  Mail,
  Box,
  X,
} from "lucide-react";
import Panel from "../components/panel";
import {
  loadPortfolio,
  sample,
  storageKey,
  validPortfolio,
  type Portfolio,
} from "../lib/portfolio";
const Garden = lazy(() => import("../components/garden"));
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function PortfolioPage() {
  const [content, setContent] = useState<Portfolio>(loadPortfolio);
  const [draft, setDraft] = useState<Portfolio>(content);
  const [panel, setPanel] = useState<"about" | "contact" | "edit" | number | null>(null);
  const [view, setView] = useState<"garden" | "list">("garden");
  const [reset, setReset] = useState(0);
  const [notice, setNotice] = useState("");
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [help, setHelp] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const close = useCallback(() => setPanel(null), []);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = () => setReduced(q.matches);
    q.addEventListener("change", listener);
    return () => q.removeEventListener("change", listener);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(id);
  }, [notice]);
  function openEditor() {
    setDraft(structuredClone(content));
    setPanel("edit");
  }
  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(draft));
      setContent(structuredClone(draft));
      setPanel(null);
      setNotice("Your changes are saved in this browser.");
    } catch {
      setNotice("Storage is unavailable. Export your content to keep a copy.");
    }
  }
  function exportContent() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tamia-portfolio.json";
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Content exported. Keep this file as your backup.");
  }
  async function importContent(f?: File) {
    if (!f) return;
    try {
      const parsed = JSON.parse(await f.text());
      if (!validPortfolio(parsed)) throw new Error();
      setDraft({
        ...parsed,
        projects:
          parsed.projects.length === 3
            ? [...parsed.projects, structuredClone(sample.projects[3])]
            : parsed.projects,
      });
      setNotice("Content imported. Choose Save changes to apply.");
    } catch {
      setNotice("Invalid file. Import an exported portfolio JSON with three or four projects.");
    }
    if (file.current) file.current.value = "";
  }
  const project = typeof panel === "number" ? content.projects[panel] : null;
  const list = (
    <div className="project-list">
      {content.projects.map((p, i) => (
        <button key={i} className={`project-tile project-${i}`} onClick={() => setPanel(i)}>
          <span className="eyebrow">
            0{i + 1} / {p.category}
          </span>
          <div className="flat-sculpture" aria-hidden="true">
            {["∩", "✳", "◎", "❋"][i]}
          </div>
          <span className="tile-bottom">
            <strong>{p.title}</strong>
            <ArrowUpRight size={24} />
          </span>
        </button>
      ))}
    </div>
  );
  return (
    <main className="portfolio">
      <header className="site-header">
        <button
          className="wordmark"
          onClick={() => {
            setPanel(null);
            setView("garden");
            setReset((r) => r + 1);
          }}
          aria-label="Return to garden"
        >
          {content.name}
          <span className="wordmark-flower">✳</span>
        </button>
        <nav aria-label="Main navigation">
          <button
            className="nav-active"
            onClick={() => {
              setPanel(null);
              document
                .getElementById("garden")
                ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
            }}
          >
            The garden
          </button>
          <button onClick={() => setPanel("about")}>About me</button>
          <button className="contact-nav" onClick={() => setPanel("contact")}>
            Let’s connect <ArrowUpRight size={16} />
          </button>
        </nav>
      </header>
      <section className="intro">
        <div>
          <div className="eyebrow intro-kicker">
            <span className="small-star">✳</span> {content.role}
          </div>
          <h1>
            A garden of
            <br />
            <em>possibilities.</em>
          </h1>
        </div>
        <div className="intro-side">
          <p>{content.intro}</p>
          <span className="availability">
            <i className={content.available ? "available" : "unavailable"} />
            {content.available ? "Open to new possibilities" : "Currently growing new ideas"}
          </span>
        </div>
        <span className="margin-note">EST. 2026 — ALWAYS GROWING</span>
      </section>
      <section
        className={`garden-stage ${view === "list" ? "list-mode" : ""}`}
        id="garden"
        aria-label="Selected projects"
      >
        <div className="garden-caption">
          <span className="eyebrow">Selected work, naturally.</span>
          <span>Pick a sculpture. Discover a story.</span>
        </div>
        {view === "garden" ? (
          <SceneBoundary fallback={list}>
            <Suspense
              fallback={
                <div className="scene-loading">
                  <Sprout size={26} />
                  <p>Growing your garden…</p>
                </div>
              }
            >
              <Garden
                projects={content.projects}
                onSelect={setPanel}
                reset={reset}
                reduced={reduced}
              />
            </Suspense>
          </SceneBoundary>
        ) : (
          list
        )}
        <div className="scene-bottom">
          <span className="drag-hint">
            <Move size={14} /> Drag to wander <span>·</span> Click to explore
          </span>
          <div className="view-tools">
            <button
              className="icon-button"
              title="Reset garden view"
              aria-label="Reset garden view"
              onClick={() => {
                setReset((r) => r + 1);
                setNotice("Garden view reset.");
              }}
            >
              <RotateCcw size={16} />
            </button>
            <span />
            <button
              className="icon-button"
              title={view === "garden" ? "Switch to project list" : "Switch to 3D garden"}
              aria-label={view === "garden" ? "Switch to project list" : "Switch to 3D garden"}
              onClick={() => setView(view === "garden" ? "list" : "garden")}
            >
              {view === "garden" ? <Grid2X2 size={17} /> : <Box size={17} />}
            </button>
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <div className="footer-note">
          <Sprout size={19} />
          <span>A little curiosity goes a long way.</span>
        </div>
        <div className="project-dock">
          <span className="dock-title">Explore</span>
          {content.projects.map((p, i) => (
            <button key={i} onClick={() => setPanel(i)}>
              <span>0{i + 1}</span>
              {p.shortTitle || p.title}
              <ArrowUpRight size={13} />
            </button>
          ))}
        </div>
        <button className="edit-button" onClick={openEditor}>
          <Pencil size={13} /> Make it yours
        </button>
      </footer>
      <div className="sub-footer">
        <span>
          © {new Date().getFullYear()} {content.name} · Always growing
        </span>
        <button onClick={() => setHelp(!help)}>
          A note about this garden <ArrowUpRight size={12} />
        </button>
      </div>
      {help && (
        <div className="help-note">
          <button aria-label="Close note" onClick={() => setHelp(false)}>
            <X size={16} />
          </button>
          <p>
            A garden of web development, research, and community. Use “Make it yours” to edit the
            bio, contact address and four projects. Changes are local to this browser; export a
            backup to transfer them. Drag the garden to rotate, scroll to zoom, or use the project
            list for keyboard-friendly browsing.
          </p>
        </div>
      )}
      {notice && (
        <output className="toast">
          <Check size={16} />
          {notice}
        </output>
      )}
      {panel !== null && (
        <Panel
          title={
            panel === "edit"
              ? "Make this garden yours"
              : panel === "about"
                ? "Meet the gardener"
                : panel === "contact"
                  ? "New possibilities"
                  : `Selected work / 0${Number(panel) + 1}`
          }
          close={close}
          wide={panel === "edit"}
        >
          {project && (
            <>
              <div className={`project-art project-${panel}`}>
                <span className="eyebrow">
                  {project.kind || "Project"} · {project.year}
                </span>
                <span className="art-glyph" aria-hidden="true">
                  {["∩", "✳", "◎", "❋"][Number(panel)]}
                </span>
                <span>{project.category}</span>
              </div>
              <h2>{project.title}</h2>
              <p className="panel-lead">{project.description}</p>
              <div className="project-details">
                <div>
                  <span className="eyebrow">My role</span>
                  <p>{project.role}</p>
                </div>
                <div>
                  <span className="eyebrow">The idea, brought to life</span>
                  <p>{project.outcome}</p>
                </div>
              </div>
              <div className="project-pagination">
                <button
                  onClick={() =>
                    setPanel(
                      (Number(panel) + content.projects.length - 1) % content.projects.length,
                    )
                  }
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                <span>
                  0{Number(panel) + 1} / 0{content.projects.length}
                </span>
                <button onClick={() => setPanel((Number(panel) + 1) % content.projects.length)}>
                  Next project <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
          {panel === "about" && (
            <>
              <div className="about-flower" aria-hidden="true">
                ✳
              </div>
              <h2>
                Rooted in curiosity.
                <br />
                <em>Growing by design.</em>
              </h2>
              <span className="eyebrow">
                {content.name} / {content.role}
              </span>
              <p className="panel-lead pre-line">{content.bio}</p>
              <button className="primary-button" onClick={() => setPanel("contact")}>
                Let’s make something good <ArrowUpRight size={17} />
              </button>
            </>
          )}
          {panel === "contact" && (
            <>
              <div className="contact-symbol">
                <Mail size={36} strokeWidth={1} />
              </div>
              <h2>
                Good things start
                <br />
                <em>with a hello.</em>
              </h2>
              <p className="panel-lead">
                Have an idea, a collaboration, or just a little curiosity? I’d love to hear it.
              </p>
              <a className="email-link" href={`mailto:${content.email}`}>
                {content.email}
                <ArrowUpRight size={24} />
              </a>
              {content.email === "hello@example.com" && (
                <p className="sample-note">
                  Sample address — replace it in “Make it yours” before sharing.
                </p>
              )}
              <span className="availability">
                <i className={content.available ? "available" : "unavailable"} />
                {content.available ? "Open to new possibilities" : "Currently growing new ideas"}
              </span>
            </>
          )}
          {panel === "edit" && (
            <>
              <h2>
                A space for <em>you.</em>
              </h2>
              <p className="editor-note">
                Edit your portfolio content below. Saved only in this browser—not across devices or
                for other visitors. Export a backup to keep or transfer your content.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  save();
                }}
              >
                <div className="form-grid">
                  {(["name", "role", "email"] as const).map((k) => (
                    <label key={k}>
                      {k === "role"
                        ? "Creative title"
                        : k === "name"
                          ? "Your name"
                          : "Contact email"}
                      <input
                        aria-label={
                          k === "role"
                            ? "Creative title"
                            : k === "name"
                              ? "Your name"
                              : "Contact email"
                        }
                        required
                        type={k === "email" ? "email" : "text"}
                        value={draft[k]}
                        onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
                      />
                    </label>
                  ))}
                  <label className="checkbox-label">
                    <input
                      aria-label="Open to opportunities"
                      type="checkbox"
                      checked={draft.available}
                      onChange={(e) => setDraft({ ...draft, available: e.target.checked })}
                    />{" "}
                    Open to opportunities
                  </label>
                </div>
                <label>
                  Short introduction
                  <textarea
                    aria-label="Short introduction"
                    rows={2}
                    value={draft.intro}
                    onChange={(e) => setDraft({ ...draft, intro: e.target.value })}
                  />
                </label>
                <label>
                  About you
                  <textarea
                    aria-label="About you"
                    rows={4}
                    value={draft.bio}
                    onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  />
                </label>
                {draft.projects.map((p, i) => (
                  <fieldset key={i}>
                    <legend>0{i + 1} / Project</legend>
                    <div className="form-grid">
                      {(["title", "shortTitle", "kind", "category", "year", "role"] as const).map(
                        (k) => (
                          <label key={k}>
                            {k}
                            <input
                              aria-label={`Project ${i + 1} ${k}`}
                              required={k !== "shortTitle" && k !== "kind"}
                              value={p[k] || ""}
                              onChange={(e) =>
                                setDraft({
                                  ...draft,
                                  projects: draft.projects.map((v, j) =>
                                    j === i ? { ...v, [k]: e.target.value } : v,
                                  ),
                                })
                              }
                            />
                          </label>
                        ),
                      )}
                    </div>
                    {(["description", "outcome"] as const).map((k) => (
                      <label key={k}>
                        {k}
                        <textarea
                          aria-label={`Project ${i + 1} ${k}`}
                          rows={3}
                          value={p[k]}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              projects: draft.projects.map((v, j) =>
                                j === i ? { ...v, [k]: e.target.value } : v,
                              ),
                            })
                          }
                        />
                      </label>
                    ))}
                  </fieldset>
                ))}
                <div className="editor-actions">
                  <button type="button" onClick={exportContent}>
                    <Download size={15} /> Export
                  </button>
                  <button type="button" onClick={() => file.current?.click()}>
                    <Upload size={15} /> Import
                  </button>
                  <button type="submit" className="primary-button">
                    <Check size={16} /> Save changes
                  </button>
                </div>
                <input
                  aria-label="Import portfolio JSON"
                  ref={file}
                  hidden
                  type="file"
                  accept="application/json,.json"
                  onChange={(e) => importContent(e.target.files?.[0])}
                />
              </form>
              <button
                className="reset-draft"
                onClick={() => {
                  setDraft(structuredClone(sample));
                  setNotice("Original portfolio loaded into the editor. Save to apply.");
                }}
              >
                Load original portfolio into editor
              </button>
            </>
          )}
        </Panel>
      )}
    </main>
  );
}
