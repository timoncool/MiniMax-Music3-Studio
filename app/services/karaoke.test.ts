import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { karaokeReason } from './karaoke';

const t = (key: string) => (key === 'songInTheBin' ? 'IN BIN: {title}' : key);

describe('karaokeReason', () => {
  it('puts the refusal of a song in the bin in the window language, with its title', () => {
    // the sentence the service writes (library::in_the_bin), so the two cannot drift apart
    const source = readFileSync(resolve(__dirname, '../../crates/music-server/src/library.rs'), 'utf8');
    const sentence = /format!\("\\"\{\}\\"( is in the library's bin; restore it in Library - Bin[^"]*)"/.exec(source)?.[1];
    expect(sentence).toBeTruthy();
    expect(karaokeReason(t, `"Song, "quoted""${sentence}`)).toBe('IN BIN: Song, "quoted"');
  });

  it('names a known code and leaves anything else as the service said it', () => {
    expect(karaokeReason(t, 'karaoke.no-words')).toBe('karaokeNoWords');
    expect(karaokeReason(t, 'karaoke.downloading 37%')).toBe('karaokeDownloading 37%');
    expect(karaokeReason(t, 'something else')).toBe('something else');
  });
});
