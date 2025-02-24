import {
  TTMLLyricLine,
  TTMLLyricPart,
  TTMLLyrics,
  TTMLMetadata,
} from "./types";

const timeRegexp =
  /^(((?<hour>[0-9]+):)?(?<min>[0-9]+):)?(?<sec>[0-9]+([.:]([0-9]{1,3}))?)$/;
function parseTime(timeSpan?: string): number | undefined {
  if (timeSpan === undefined) return;
  const matches = timeRegexp.exec(timeSpan);
  if (!matches) {
    return 0;
  }
  const hour = Number(matches.groups?.hour || "0");
  const min = Number(matches.groups?.min || "0");
  const sec = Number(matches.groups?.sec.replace(/:/, ".") || "0");
  return Math.floor((hour * 3600 + min * 60 + sec) * 1000);
}

export function parse(ttml: string): TTMLLyrics {
  const domParser = new DOMParser();
  const doc: XMLDocument = domParser.parseFromString(ttml, "text/xml");
  // console.log(doc);
  // debugger;
  const ttMeta: TTMLMetadata[] = [];
  const ttParts: TTMLLyricPart[] = [];
  // debugger;
  // let singerInfo: { type: "person" | "other" | string; id: string }[];
  let singerInfo: Record<string, "person" | "other" | string> = {};
  const metadata = doc.querySelector("metadata")?.children || [];
  for (let i = 0; i < metadata.length; i++) {
    const meta = metadata[i];
    let key: string | undefined = "";
    let value: string | undefined = "";
    // TODO: Implement This
    if (meta.tagName == "iTunesMetadata") {
      // debugger;
      const iTunesMetadata = meta.children || [];
      for (let j = 0; j < iTunesMetadata.length; j++) {
        const iTunesMetadataElement = iTunesMetadata[j];
        const iTunesMetadataElements = iTunesMetadataElement.children || [];
        switch (iTunesMetadataElement.tagName) {
          case "songwriters":
            for (let k = 0; k < iTunesMetadataElements.length; k++) {
              if (iTunesMetadataElements[k].tagName === "songwriter") {
                key = "artists";
                value = iTunesMetadataElements[k].innerHTML;
              }
              if (!key) continue;
              if (!value) continue;
              const existing = ttMeta.find((m) => m.key === key);
              if (existing) {
                existing.value.push(value);
                continue;
              }
              ttMeta.push({ key, value: [value] });
              continue;
            }
            break;
        }
      }
      // if (!key) continue;
      // if (!value) continue;
      // const existing = ttMeta.find((m) => m.key === key);
      // if (existing) {
      //   existing.value.push(value);
      //   continue;
      // }
      // ttMeta.push({ key, value: [value] });
      // continue;
    }
    if (!key) key = meta.getAttribute("key") || undefined;
    if (!value) value = meta.getAttribute("value") || undefined;
    if (key == "ttm:agent") {
      const type = meta.getAttribute("type");
      const id = meta.getAttribute("xml:id");
      if (!type || !id) continue;
      // singerInfo.push({ type, id });
      singerInfo[id] = type;
    }
    if (!key) continue;
    if (!value) continue;
    const existing = ttMeta.find((m) => m.key === key);
    if (existing) {
      existing.value.push(value);
      continue;
    }
    ttMeta.push({ key, value: [value] });
  }

  const body = doc.getElementsByTagName("body")[0];
  const divs = body.getElementsByTagName("div");
  for (let i = 0; i < divs.length; i++) {
    const ttLines: TTMLLyricLine[] = [];
    const div = divs[i];

    const ps = div.getElementsByTagName("p");
    function parseP(p: Element, isBackground = false) {
      // console.log(p);
      const nodes = p.childNodes || [];
      // const spans = p.getElementsByTagName("span");
      if (!nodes.length) {
        if (!p.textContent) return;
        // Static Lyrics
        const line: TTMLLyricLine = {
          words: [
            {
              text: p.textContent,
            },
          ],
          isBackground,
          isSecondary: p.getAttribute("ttm:agent") === "v2",
          translatedLyric: "",
          romanLyric: "",
        };
        ttLines.push(line);
        return;
      }
      const line: TTMLLyricLine = {
        words: [],
        translatedLyric: "",
        romanLyric: "",
        isBackground,
        isSecondary: p.getAttribute("ttm:agent") === "v2",
        startTime: parseTime(p.getAttribute("begin") || ""),
        endTime: parseTime(p.getAttribute("end") || ""),
      };
      // const startTimeLyrics = parseTime(p.getAttribute("startTime") || "");
      // const endTimeLyrics = parseTime(p.getAttribute("entTime") || "");
      let includeBackground = false;
      function parseSpan(span: Element) {
        if (span.getAttribute("ttm:role") === "x-bg") {
          // debugger;
          parseP(span, true);
          includeBackground = true;
          return;
        } else if (
          span.getAttribute("ttm:role") === "x-translation" &&
          span.textContent
        ) {
          line.translatedLyric = span.textContent;
          return;
        } else if (
          span.getAttribute("ttm:role") === "x-roman" &&
          span.textContent
        ) {
          line.romanLyric = span.textContent;
          return;
        }
        const division =
          typeof span.getAttribute("amll:empty-beat") === "string"
            ? Number(span.getAttribute("amll:empty-beat"))
            : undefined;
        const startTime = parseTime(span.getAttribute("begin") || "");
        const endTime = parseTime(span.getAttribute("end") || "");
        // debugger;
        const word = span.textContent;
        if (!word) return;
        line.words.push({
          startTime,
          endTime,
          text: word,
          division,
        });
      }
      for (let j = 0; j < nodes.length; j++) {
        const node = nodes[j];
        // console.log();
        if (!node) continue;
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (text === null) return;
          line.words.push({
            text: text,
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.tagName == "span") {
            parseSpan(element);
          }
        } else {
          debugger;
        }
      }

      // ttLines.push(line);
      if (includeBackground) {
        const insertIndex = ttLines.length - 1;
        ttLines.splice(insertIndex, 0, line);
      } else {
        ttLines.push(line);
      }
    }
    for (let j = 0; j < ps.length; j++) {
      const p = ps[j];
      const backgroundPreVariable =
        singerInfo[p.getAttribute("ttm:agent") || ""] === "other";
      parseP(p, backgroundPreVariable);
    }

    ttParts[i] = {
      type: div.getAttribute("itunes:songPart") || undefined,
      lines: ttLines,
      begin: parseTime(div.getAttribute("begin") || undefined),
      end: parseTime(div.getAttribute("end") || undefined),
    };
  }

  // debugger;

  return {
    language: doc.documentElement.getAttribute("xml:lang") || undefined,
    metadata: ttMeta,
    parts: ttParts,
  };
}

export default { parse };
