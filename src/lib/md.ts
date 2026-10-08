// A small Markdown renderer for the documents (proposal, agreement): headings, paragraphs, lists, tables, bold, italic, links.
// Builds DOM nodes, never HTML strings, so document text can never inject markup.
export function renderMarkdown(md: string, into: HTMLElement) {
  into.replaceChildren();
  const lines = md.replace(/\r/g, "").split("\n");
  let i = 0;
  const inline = (text: string, parent: HTMLElement) => {
    // **bold**, *italic*, [text](url)
    const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))/g;
    let last = 0, m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
      if (m[2]) { const b = document.createElement("strong"); b.textContent = m[2]; parent.appendChild(b); }
      else if (m[3]) { const em = document.createElement("em"); em.textContent = m[3]; parent.appendChild(em); }
      else if (m[4]) { const a = document.createElement("a"); a.textContent = m[4]; a.href = m[5]; a.rel = "noopener"; a.target = "_blank"; parent.appendChild(a); }
      last = m.index + m[0].length;
    }
    if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
  };
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { const el = document.createElement(`h${h[1].length}`); inline(h[2], el); into.appendChild(el); i++; continue; }
    if (/^\s*[-*]\s+/.test(line)) {
      const ul = document.createElement("ul");
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { const li = document.createElement("li"); inline(lines[i].replace(/^\s*[-*]\s+/, ""), li); ul.appendChild(li); i++; }
      into.appendChild(ul); continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const ol = document.createElement("ol");
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { const li = document.createElement("li"); inline(lines[i].replace(/^\s*\d+\.\s+/, ""), li); ol.appendChild(li); i++; }
      into.appendChild(ol); continue;
    }
    if (/^\|/.test(line) && /^\|/.test(lines[i + 1] ?? "")) {
      const table = document.createElement("table");
      const rows: string[][] = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i].split("|").slice(1, -1).map((c) => c.trim())); i++; }
      rows.forEach((cells, r) => {
        if (r === 1 && cells.every((c) => /^:?-+:?$/.test(c))) return;
        const tr = document.createElement("tr");
        cells.forEach((c) => { const td = document.createElement(r === 0 ? "th" : "td"); inline(c, td); tr.appendChild(td); });
        table.appendChild(tr);
      });
      into.appendChild(table); continue;
    }
    const p = document.createElement("p");
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|\s*[-*]\s|\s*\d+\.\s|\|)/.test(lines[i])) { para.push(lines[i].trim()); i++; }
    inline(para.join(" "), p);
    into.appendChild(p);
  }
}
