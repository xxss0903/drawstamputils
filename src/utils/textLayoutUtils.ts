const RTL_CHAR_RE =
  /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFB4F\uFB50-\uFDFF\uFE70-\uFEFF]/

export function isRtlText(text: string): boolean {
  return RTL_CHAR_RE.test(text)
}

export function segmentGraphemes(text: string): string[] {
  const Segmenter = (Intl as any)?.Segmenter as
    | (new (
        locales?: string | string[],
        options?: { granularity?: "grapheme" | "word" | "sentence" }
      ) => {
        segment: (input: string) => Iterable<{ segment: string }>
      })
    | undefined

  if (Segmenter) {
    const segmenter = new Segmenter(undefined, { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), (x) => x.segment)
  }

  return Array.from(text)
}

export function countGraphemes(text: string): number {
  return segmentGraphemes(text).length
}

export function segmentWords(text: string): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  return trimmed.split(/\s+/g).filter(Boolean)
}

export type ArcSegment = { text: string; units: number }

export function getArcSegments(text: string, preferWords: boolean): ArcSegment[] {
  if (preferWords) {
    const words = segmentWords(text)
    if (words.length >= 2) {
      return words.map((w) => ({ text: w, units: Math.max(1, countGraphemes(w)) }))
    }
  }

  const graphemes = segmentGraphemes(text)
  return graphemes.map((g) => ({ text: g, units: 1 }))
}

