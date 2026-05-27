const WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do",
  "eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim",
  "ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip",
  "ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate",
  "velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat",
  "non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est",
  "laborum","at","vero","eos","accusamus","iusto","odio","dignissimos","ducimus","blanditiis",
  "praesentium","voluptatum","deleniti","atque","corrupti","quos","dolores","quas","molestias",
  "excepturi","occaecati","provident","similique","mollitia","animi","officiis","fugit",
];

function pickWord(rand: () => number): string {
  return WORDS[Math.floor(rand() * WORDS.length)]!;
}

function makeSentence(rand: () => number, minWords = 6, maxWords = 14): string {
  const len = minWords + Math.floor(rand() * (maxWords - minWords + 1));
  const words: string[] = [];
  for (let i = 0; i < len; i++) words.push(pickWord(rand));
  const first = words[0]!;
  words[0] = first.charAt(0).toUpperCase() + first.slice(1);
  return words.join(" ") + ".";
}

function makeParagraph(rand: () => number, minSentences = 3, maxSentences = 6): string {
  const len = minSentences + Math.floor(rand() * (maxSentences - minSentences + 1));
  const sentences: string[] = [];
  for (let i = 0; i < len; i++) sentences.push(makeSentence(rand));
  return sentences.join(" ");
}

// Tiny PRNG so output is deterministic-ish per call (Math.random is fine but
// keeps signature consistent).
function rng(): () => number {
  return Math.random;
}

export function generateLoremWords(count: number): string {
  const r = rng();
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(pickWord(r));
  if (out.length === 0) return "";
  const first = out[0]!;
  out[0] = first.charAt(0).toUpperCase() + first.slice(1);
  return out.join(" ") + ".";
}

export function generateLoremSentences(count: number): string {
  const r = rng();
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(makeSentence(r));
  return out.join(" ");
}

export function generateLoremParagraphs(count: number): string {
  const r = rng();
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(makeParagraph(r));
  return out.join("\n\n");
}
