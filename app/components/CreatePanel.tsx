import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { karaokeReason } from '../services/karaoke';
import { AlertTriangle, ChevronDown, CircleAlert, Dices, FolderOpen, Loader2, RotateCcw, Save, Sparkles, Square, Tags, Trash2, Wand2, Settings2, X } from 'lucide-react';
import type { Music3Request, Song } from '../types';
import { useI18n } from '../context/I18nContext';
import { saveFile } from '../services/saveFile';
import { useBridgeCommand } from '../services/mcpBridge';
import { joinCaption, randomExample, splitCaption } from '../services/examples';
import { AdapterPicker } from './AdapterPicker';
import { usesFromSettings, type AdapterUse } from '../services/adapters';

/**
 * The Music3 request form.
 *
 * The layout follows what every implementation of this model agrees on — the
 * reference client shipped with the engine, ComfyUI's native nodes and MiniMax's
 * own model card:
 *
 *   * the request is grouped by pipeline stage: prompt, LM configuration, flow
 *     matching, post-processing, components;
 *   * a field left empty means "use the engine default", which is shown as the
 *     placeholder, so the submitted request stays sparse;
 *   * the caption is a structured document — Global Metadata, Vocal Details,
 *     Arrangement — not a one-line prompt, and the lyrics carry bracketed
 *     section tags;
 *   * duration is a *maximum*: the model may end the song earlier.
 *
 * Writing that caption from a one-line idea is a text-LLM job, which this model
 * cannot do — its own language model emits audio codes. Every project solves it
 * with a separate text model, so the assistant here is an optional extra, never
 * the primary way in.
 */

interface CreatePanelProps {
  onGenerate: (request: Music3Request & { _tempId?: string }) => void;
  isGenerating: boolean;
  activeJobCount?: number;
  initialData?: { song: Song; timestamp: number } | null;
}

type EngineDefaults = Partial<Record<string, number | string>>;

type ProfileFiles = { lm_model: string; depth_model: string; cond_model: string; dit_model: string; vae_model: string };

type SetupStatus = {
  ready?: boolean;
  profile_files?: ProfileFiles | null;
  engine_ready?: boolean;
  selected_profile_id?: string | null;
  selected_component_ids?: string[] | null;
  effective_max_batch?: number;
  hardware?: { reason?: string };
};

type EngineCatalog = {
  defaults?: EngineDefaults;
  models?: { lm?: string[]; depth?: string[]; cond?: string[]; dit?: string[]; vae?: string[] };
};

/** 9000 acoustic frames at 25 frames per second, as the model card states. */
const MAX_DURATION_SECONDS = 360;
/** The tokenized caption + lyrics budget the engine enforces at submit. */
const MAX_PROMPT_TOKENS = 5000;

const PROFILE_LABEL: Record<string, string> = {
  native: 'Full Native',
  'quality-q8': 'Q8 Quality',
  balanced: 'Balanced',
  'recommended-light': 'Light',
};

const CONTROL =
  'w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-pink-500 disabled:opacity-50 dark:border-white/10 dark:bg-black/25 dark:text-white';
const CARD = 'rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-suno-card';
const LABEL = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400';
const TOOL =
  'inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 transition-colors hover:border-pink-400 hover:text-pink-600 dark:border-white/10 dark:text-zinc-300';

const numberOrUndefined = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/** A rough token estimate, only used to warn before the engine rejects it. */
const estimateTokens = (text: string) => Math.ceil(text.trim().length / 3.6);

// The engine refuses empty lyrics, and an instrumental is written as a song's
// structure with no words under its tags: the tags of the lyrics in the box,
// their lines left out, or a plain song shape when the box has none.
const instrumentalLyrics = (text: string) => {
  const tags = text.split(/\r?\n/).map(line => line.trim()).filter(line => /^\[[^\]]+\]$/.test(line));
  return (tags.length ? tags : ['[intro]', '[verse]', '[chorus]', '[verse]', '[chorus]', '[outro]']).join('\n\n');
};

const ICON =
  'rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-black dark:hover:bg-white/10 dark:hover:text-white disabled:opacity-40';

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <label className="block">
    <span className={LABEL}>{label}</span>
    {children}
    {hint && <span className="mt-1 block text-[11px] leading-4 text-zinc-500">{hint}</span>}
  </label>
);

/** The toggle used throughout the studio: a real switch, not a tick box. */
const Switch: React.FC<{ checked: boolean; onChange: (value: boolean) => void; label: string; hint?: string }> = ({ checked, onChange, label, hint }) => (
  <div className="flex items-center justify-between gap-3">
    <div className="min-w-0">
      <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</span>
      {hint && <p className="mt-0.5 text-[11px] leading-4 text-zinc-500">{hint}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-10 shrink-0 rounded-full transition-colors ${checked ? 'bg-pink-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}
    >
      <span className={`absolute top-[2px] h-4 w-4 rounded-full bg-white shadow-sm transition-all ${checked ? 'left-[22px]' : 'left-[2px]'}`} />
    </button>
  </div>
);

/**
 * A number you drag, with the value beside it.
 *
 * An empty field means "engine default", and that has to survive: the slider
 * shows the default until it is touched, and the reset action puts it back.
 */
const SliderRow: React.FC<{
  label: string;
  value: string;
  fallback: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ label, value, fallback, min, max, step, suffix, onChange, disabled }) => {
  const current = value.trim() === '' ? fallback : Number(value);
  const shown = Number.isFinite(current) ? current : fallback;
  const decimals = step < 1 ? String(step).split('.')[1]?.length ?? 1 : 0;
  return (
    <div className={disabled ? 'opacity-50' : undefined}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</span>
        <span className="text-[11px] tabular-nums text-zinc-600 dark:text-zinc-300">
          {shown.toFixed(decimals)}{suffix ?? ''}
          {value.trim() === '' && <span className="ml-1 text-zinc-400">·</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={shown}
        disabled={disabled}
        onChange={event => onChange(event.target.value)}
        className="mt-1.5 h-1 w-full cursor-pointer accent-pink-500"
      />
    </div>
  );
};

/** A group inside Advanced: what this stage is, and what these knobs do. */
const Stage: React.FC<{ title: string; hint: string; children: React.ReactNode }> = ({ title, hint, children }) => (
  <section>
    <h4 className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{title}</h4>
    <p className="mb-3 mt-0.5 text-[11px] leading-4 text-zinc-500">{hint}</p>
    {children}
  </section>
);

/** A card with a titled header strip, the way the panels are built elsewhere. */
const Card: React.FC<{ title: string; actions?: React.ReactNode; children: React.ReactNode }> = ({ title, actions, children }) => (
  <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-white/5 dark:bg-suno-card">
    <div className="flex items-center justify-between gap-2 border-b border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-white/5 dark:bg-white/5">
      <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{title}</span>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </div>
    <div className="p-3">{children}</div>
  </div>
);

/** Grows with its content: these sections run to a thousand characters. */
const AutoTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { minRows?: number }> = ({ minRows = 3, value, ...rest }) => {
  const node = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const element = node.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${Math.max(element.scrollHeight, minRows * 20)}px`;
  }, [value, minRows]);
  return <textarea ref={node} value={value} rows={minRows} {...rest} />;
};

/** One labelled section of the structured caption. */
const Pane: React.FC<{
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}> = ({ label, value, placeholder, onChange }) => (
  <div className="rounded-lg border border-zinc-200 bg-zinc-50 focus-within:border-pink-500 dark:border-white/10 dark:bg-black/25">
    <div className="flex items-center justify-between px-2.5 pt-2">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-[10px] tabular-nums text-zinc-400">{value.length}</span>
    </div>
    <AutoTextarea
      value={value}
      minRows={4}
      onChange={event => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full resize-none bg-transparent px-2.5 pb-2.5 pt-1 text-sm leading-5 text-zinc-900 outline-none dark:text-white"
    />
  </div>
);

export const CreatePanel: React.FC<CreatePanelProps> = ({ onGenerate, isGenerating, activeJobCount = 0, initialData }) => {
  const { t } = useI18n();

  const [name, setName] = useState('');
  // The caption is three labelled panes, the way the model was trained and the
  // way MiniMax's own demo edits it.
  const [globalMetadata, setGlobalMetadata] = useState('');
  const [vocalDetails, setVocalDetails] = useState('');
  const [arrangement, setArrangement] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [instrumental, setInstrumental] = useState(false);
  const [randomizeSeed, setRandomizeSeed] = useState(true);

  // Parameters are strings so an empty field can mean "engine default".
  const [duration, setDuration] = useState('');
  const [lmSeed, setLmSeed] = useState('');
  const [lmCfg, setLmCfg] = useState('');
  const [lmTopK, setLmTopK] = useState('');
  const [audioCodes, setAudioCodes] = useState('');
  const [steps, setSteps] = useState('');
  const [ditCfg, setDitCfg] = useState('');
  const [synthBatch, setSynthBatch] = useState('');
  // A track read back into the codes the engine renders from. Nothing here
  // changes a request until a file is chosen: no file, no field, and the
  // studio behaves exactly as it did before this existed.
  const [seed, setSeed] = useState('');
  const [peakClip, setPeakClip] = useState('');
  // Quality first, not "quick listen": the engine's own defaults are mp3 at
  // 128 kbps, which throws away what the vocoder produced.
  const [mp3Bitrate, setMp3Bitrate] = useState('320');
  // The engine's own default is 128 kbps, which throws away what the vocoder
  // produced; 320 is the top the encoder offers and costs a few megabytes.
  const [format, setFormat] = useState<Music3Request['output_format']>('mp3');
  const [models, setModels] = useState<Record<string, string>>({});
  const [adapters, setAdapters] = useState<AdapterUse[]>([]);

  // A picked LoRA's trigger word leads the global metadata; removing the LoRA takes it out again.
  const applyTrigger = useCallback((word: string, present: boolean) => {
    setGlobalMetadata(current => {
      const parts = current.split(',').map(part => part.trim());
      const has = parts.some(part => part.toLowerCase() === word.toLowerCase());
      // into an empty field the word comes with its comma, so what is typed next stays apart
      if (present) return has ? current : current.trim() ? `${word}, ${current.trim()}` : `${word}, `;
      return has ? parts.filter(part => part.toLowerCase() !== word.toLowerCase()).join(', ') : current;
    });
  }, []);

  const [setup, setSetup] = useState<SetupStatus | null>(null);
  // "Nobody answered" and "the engine says it has no models" are different
  // problems, and telling the user to download 12 GB when the service is simply
  // down is a lie.
  const [serviceDown, setServiceDown] = useState(false);
  const [catalog, setCatalog] = useState<EngineCatalog | null>(null);
  const [assistantReady, setAssistantReady] = useState(false);
  const [assisting, setAssisting] = useState<'all' | 'lyrics' | 'prompt' | 'sections' | null>(null);
  // What the assistant is doing right now, and what it has written so far.
  const [assistStage, setAssistStage] = useState<string | null>(null);
  const [assistModel, setAssistModel] = useState<string | null>(null);
  const [assistDraft, setAssistDraft] = useState('');
  // What the assistant said the cover should show; sent with the request so the
  // automatic cover uses it instead of the generic template.
  const [coverPrompt, setCoverPrompt] = useState('');
  // What the studio is doing to finished tracks: covers and karaoke timings run
  // after generation, and used to run in complete silence.
  const [activity, setActivity] = useState<Array<{ song_id: string; title: string; kind: string; state: string; detail?: string }>>([]);
  useEffect(() => {
    // Finished work changes the track on screen - a cover appears, timings
    // arrive - so the library is told to reread it rather than waiting for the
    // next thing that happens to reload the list.
    let finished = '';
    const read = () => void fetch('/v1/activity')
      .then(response => response.json())
      .then((body: { activity?: typeof activity }) => {
        const entries = body.activity ?? [];
        const done = entries.filter(entry => entry.state === 'done').map(entry => `${entry.song_id}:${entry.kind}`).join(',');
        if (done !== finished) {
          finished = done;
          window.dispatchEvent(new CustomEvent('mm3:library-changed'));
        }
        setActivity(entries);
      })
      .catch(() => undefined);
    read();
    const timer = window.setInterval(read, 2000);
    return () => window.clearInterval(timer);
  }, []);
  // A local model takes tens of seconds to answer. A spinner alone reads as a
  // hung button, so the panel counts the seconds out loud.
  const [assistSeconds, setAssistSeconds] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mode, setMode] = useState<'simple' | 'studio'>('studio');
  const [assistInstruction, setAssistInstruction] = useState('');
  const [error, setError] = useState<string | null>(null);
  const promptFile = useRef<HTMLInputElement | null>(null);

  const ready = setup?.ready === true && setup?.engine_ready === true;
  const defaults = catalog?.defaults ?? {};
  const placeholder = (key: string) => (defaults[key] === undefined ? '' : String(defaults[key]));
  const caption = joinCaption(globalMetadata, vocalDetails, arrangement);
  const promptTokens = estimateTokens(caption) + estimateTokens(lyrics);

  const profileLabel = useMemo(() => {
    if (setup?.selected_component_ids?.length) return t('customSet');
    const id = setup?.selected_profile_id;
    return id ? PROFILE_LABEL[id] ?? id : '—';
  }, [setup, t]);

  useEffect(() => {
    if (!assisting) return;
    setAssistSeconds(0);
    const started = Date.now();
    const timer = window.setInterval(() => setAssistSeconds(Math.round((Date.now() - started) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [assisting]);

  const refreshSetup = useCallback(async () => {
    const response = await fetch('/setup/status');
    if (!response.ok) throw new Error(String(response.status));
    setSetup(await response.json());
    setServiceDown(false);
  }, []);

  useEffect(() => {
    const poll = () => void refreshSetup().catch(() => { setSetup(null); setServiceDown(true); });
    poll();
    const timer = window.setInterval(poll, 5000);
    return () => window.clearInterval(timer);
  }, [refreshSetup]);

  useEffect(() => {
    void fetch('/v1/local-models/music')
      .then(response => (response.ok ? response.json() : Promise.reject(new Error())))
      .then((body: { catalog?: EngineCatalog }) => setCatalog(body.catalog ?? null))
      .catch(() => setCatalog(null));
  }, [setup?.engine_ready]);

  useEffect(() => {
    // Asked once at mount, the panel kept saying "configure the assistant"
    // long after the assistant had been configured. It is asked again while it
    // is not ready, and whenever the settings are closed.
    const read = () => void fetch('/v1/assistant/status')
      .then(response => (response.ok ? response.json() : Promise.reject(new Error())))
      .then((body: { available?: boolean }) => setAssistantReady(body.available === true))
      .catch(() => setAssistantReady(false));
    read();
    const timer = window.setInterval(read, 5000);
    window.addEventListener('mm3:settings-changed', read);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('mm3:settings-changed', read);
    };
  }, []);

  useEffect(() => {
    if (!initialData?.song) return;
    const song = initialData.song;
    setName(song.title || '');
    const panes = splitCaption(song.style || '');
    setGlobalMetadata(panes.globalMetadata);
    setVocalDetails(panes.vocalDetails);
    setArrangement(panes.arrangement);
    setLyrics(song.lyrics || '');
    const settings = (song.generationParams ?? {}) as EngineDefaults;
    const asString = (key: string) => (settings[key] === undefined ? '' : String(settings[key]));
    setDuration(asString('duration'));
    setSteps(asString('steps'));
    setLmCfg(asString('lm_cfg'));
    setLmTopK(asString('lm_top_k'));
    setDitCfg(asString('dit_cfg'));
    setPeakClip(asString('peak_clip'));
    setMp3Bitrate(asString('mp3_bitrate'));
    if (typeof settings.output_format === 'string') setFormat(settings.output_format as Music3Request['output_format']);
    // A song made without LoRA reuses without it, whatever was picked before.
    setAdapters(usesFromSettings(settings as Record<string, unknown>));
  }, [initialData]);

  const reset = () => {
    setName(''); setGlobalMetadata(''); setVocalDetails(''); setArrangement(''); setLyrics(''); setInstrumental(false);
    setDuration(''); setLmSeed(''); setLmCfg(''); setLmTopK(''); setAudioCodes('');
    setSteps(''); setDitCfg(''); setSynthBatch(''); setSeed('');
    setPeakClip(''); setMp3Bitrate('320'); setFormat('mp3'); setModels({}); setAdapters([]);
    setError(null);
  };

  /** One of the official demo prompts bundled with the engine. */
  const loadExample = () => {
    const example = randomExample();
    setGlobalMetadata(example.globalMetadata);
    setVocalDetails(example.vocalDetails);
    setArrangement(example.arrangement);
    setLyrics(example.lyrics);
    setDuration(String(example.duration));
    setName(example.name);
    setError(null);
  };

  const buildRequest = () => {
    const request: Music3Request & { title?: string; cover_prompt?: string; audio_codes?: string; models?: Record<string, string> } = {
      caption: caption.trim(),
      // An instrumental has no words, whatever is still sitting in the box. The
      // lyrics of the previous track stayed there, went to the engine and came
      // back sung: the switch said instrumental and the track had vocals.
      lyrics: instrumental ? instrumentalLyrics(lyrics) : lyrics.replace(/\r\n?/g, '\n').trim(),
      duration_seconds: Math.min(numberOrUndefined(duration) ?? 60, MAX_DURATION_SECONDS),
      steps: numberOrUndefined(steps) ?? 30,
      seed: randomizeSeed ? undefined : numberOrUndefined(seed),
      lm_seed: numberOrUndefined(lmSeed),
      lm_cfg: numberOrUndefined(lmCfg) ?? 1.5,
      lm_top_k: numberOrUndefined(lmTopK) ?? 50,
      lm_batch_size: 1,
      synth_batch_size: numberOrUndefined(synthBatch) ?? 1,
      dit_cfg: numberOrUndefined(ditCfg) ?? 1.7,
      peak_clip: numberOrUndefined(peakClip) ?? 10,
      output_format: format,
      mp3_bitrate: numberOrUndefined(mp3Bitrate) ?? 320,
    };
    if (name.trim()) request.title = name.trim();
    if (coverPrompt.trim()) request.cover_prompt = coverPrompt.trim();
    if (audioCodes.trim()) request.audio_codes = audioCodes.trim();
    if (Object.keys(models).length === 5) request.models = models;
    if (adapters.length > 0) request.adapters = adapters;
    return request;
  };

  const savePrompt = () => void saveFile(
    `${(name.trim() || 'request').replace(/[\\/:*?"<>|]/g, '')}.json`,
    { blob: new Blob([JSON.stringify(buildRequest(), null, 2)], { type: 'application/json' }) },
  );

  const openPrompt = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as Record<string, unknown>;
      const asString = (value: unknown) => (typeof value === 'number' || typeof value === 'string' ? String(value) : '');
      if (typeof parsed.title === 'string') setName(parsed.title);
      if (typeof parsed.caption === 'string') {
        const panes = splitCaption(parsed.caption);
        setGlobalMetadata(panes.globalMetadata);
        setVocalDetails(panes.vocalDetails);
        setArrangement(panes.arrangement);
      }
      if (typeof parsed.lyrics === 'string') setLyrics(parsed.lyrics);
      setDuration(asString(parsed.duration ?? parsed.duration_seconds));
      setSteps(asString(parsed.steps));
      setLmCfg(asString(parsed.lm_cfg));
      setLmTopK(asString(parsed.lm_top_k));
      setLmSeed(asString(parsed.lm_seed));
      setDitCfg(asString(parsed.dit_cfg));
      setSynthBatch(asString(parsed.synth_batch_size));
      setSeed(asString(parsed.seed));
      setPeakClip(asString(parsed.peak_clip));
      setMp3Bitrate(asString(parsed.mp3_bitrate));
      if (typeof parsed.audio_codes === 'string') setAudioCodes(parsed.audio_codes);
      if (typeof parsed.output_format === 'string') setFormat(parsed.output_format as Music3Request['output_format']);
      if (Array.isArray(parsed.adapters)) setAdapters(usesFromSettings(parsed));
      setError(null);
    } catch {
      setError(t('promptFileInvalid'));
    }
  };

  /// Optional. Nothing here is required to use the model: the manual form is
  /// the primary path, and the buttons stay disabled until a provider is set.
  // A run in progress can be given up on. The request is a stream that can
  // take minutes on a reasoning model, and without this the only way out of one
  // that went quiet was to close the studio.
  // Without an assistant the wands open its settings: hidden, they left no
  // sign that the studio can write a style or lyrics at all.
  const openAssistantSetup = () => window.dispatchEvent(new CustomEvent('mm3:open-settings', { detail: 'models:assistant' }));

  const assistRun = useRef<AbortController | null>(null);
  const stopAssistant = () => {
    assistRun.current?.abort();
    assistRun.current = null;
    setAssisting(null);
    setAssistStage(null);
    setAssistDraft('');
  };
  const askAssistant = async (target: 'all' | 'lyrics' | 'prompt') => {
    if (!assistantReady || assisting) return;
    const run = new AbortController();
    assistRun.current = run;
    setAssisting(target);
    setError(null);
    try {
      const payload = JSON.stringify({
        target,
        description: name.trim(),
        instruction: assistInstruction.trim(),
        lyrics: lyrics.trim(),
        global_metadata: globalMetadata.trim().replace(/,$/, '').trimEnd(),
        vocal_details: vocalDetails.trim(),
        arrangement: arrangement.trim(),
        duration_seconds: numberOrUndefined(duration) ?? 60,
        instrumental,
      });

      // Watch the same request happen: the studio reports when it goes out,
      // when the model starts answering, and then the text as it arrives. The
      // draft appears in front of the user instead of after a minute of
      // nothing.
      setAssistStage('preparing');
      setAssistDraft('');
      let streamed = '';
      const live = await fetch('/v1/assistant/write/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        signal: run.signal,
      });
      if (!live.ok || !live.body) {
        const refused = await live.json().catch(() => null);
        throw new Error(refused?.error || String(live.status));
      }
      let body: Record<string, unknown> | null = null;
      {
        const reader = live.body.getReader();
        const decoder = new TextDecoder();
        let carry = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          carry += decoder.decode(value, { stream: true });
          let split = carry.indexOf('\n\n');
          while (split !== -1) {
            const frame = carry.slice(0, split).trim();
            carry = carry.slice(split + 2);
            split = carry.indexOf('\n\n');
            if (!frame.startsWith('data:')) continue;
            let event: { stage?: string; delta?: string; text?: string; error?: string; model?: string; draft?: Record<string, unknown> };
            try {
              event = JSON.parse(frame.slice(5).trim());
            } catch {
              continue;
            }
            if (event.error) throw new Error(event.error);
            if (event.stage) setAssistStage(event.stage);
            if (event.draft) body = event.draft;
            if (event.model) setAssistModel(event.model);
            if (event.delta) {
              streamed += event.delta;
              setAssistDraft(streamed);
            }
          }
        }
      }
      if (!body) throw new Error(t('assistantNoAnswer'));
      if (typeof body?.lyrics === 'string') setLyrics(body.lyrics);
      if (typeof body?.global_metadata === 'string') setGlobalMetadata(body.global_metadata);
      if (typeof body?.vocal_details === 'string') setVocalDetails(body.vocal_details);
      if (typeof body?.arrangement === 'string') setArrangement(body.arrangement);
      // The model has the words and the mood in front of it, so it names the
      // track and says what its cover should show.
      if (typeof body?.title === 'string' && body.title.trim()) setName(body.title.trim());
      if (typeof body?.cover_prompt === 'string' && body.cover_prompt.trim()) setCoverPrompt(body.cover_prompt.trim());
      // The assistant wrote the sections, so it knows how long they take; the
      // form's 60 seconds is a default, not a decision anyone made.
      if (typeof body?.duration_seconds === 'number' && body.duration_seconds >= 10) {
        setDuration(String(Math.min(360, Math.round(body.duration_seconds))));
      }
      // The tab stays where it was. Switching to Studio showed what the
      // assistant had written, but it moved the user off the screen they were
      // working on to do it, and they can look for themselves.
    } catch (reason) {
      // Giving up on a run is not an error to report back at the person who
      // gave up on it.
      const cancelled = reason instanceof DOMException && reason.name === 'AbortError';
      if (!cancelled) setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      assistRun.current = null;
      setAssisting(null);
      setAssistStage(null);
      setAssistDraft('');
    }
  };

  // Tags the lyrics already in the form: the assistant marks where each
  // section starts, the words stay exactly as written.
  const layOutLyrics = async () => {
    if (!assistantReady || assisting || !lyrics.trim()) return;
    const run = new AbortController();
    assistRun.current = run;
    setAssisting('sections');
    setError(null);
    try {
      const response = await fetch('/v1/assistant/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics }),
        signal: run.signal,
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || typeof body?.lyrics !== 'string') throw new Error(body?.error || String(response.status));
      setLyrics(body.lyrics);
    } catch (reason) {
      const cancelled = reason instanceof DOMException && reason.name === 'AbortError';
      if (!cancelled) setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      assistRun.current = null;
      setAssisting(null);
    }
  };

  const submit = () => {
    if (!ready) { setError(t('downloadProfileFirst')); return; }
    if (!caption.trim()) { setError(t('captionRequired')); return; }
    if (!instrumental && !lyrics.trim()) { setError(t('lyricsRequired')); return; }
    if (promptTokens > MAX_PROMPT_TOKENS) { setError(t('promptTooLong')); return; }
    setError(null);
    onGenerate(buildRequest());
  };

  // An agent connected over MCP reads and fills this form as the user sees it
  const formFields: Record<string, [unknown, (value: string) => void]> = {
    title: [name, setName],
    global_metadata: [globalMetadata, setGlobalMetadata],
    vocal_details: [vocalDetails, setVocalDetails],
    arrangement: [arrangement, setArrangement],
    lyrics: [lyrics, setLyrics],
    duration_seconds: [duration, setDuration],
    steps: [steps, setSteps],
    lm_seed: [lmSeed, setLmSeed],
    lm_cfg: [lmCfg, setLmCfg],
    lm_top_k: [lmTopK, setLmTopK],
    dit_cfg: [ditCfg, setDitCfg],
    synth_batch_size: [synthBatch, setSynthBatch],
    seed: [seed, setSeed],
    audio_codes: [audioCodes, setAudioCodes],
    cover_prompt: [coverPrompt, setCoverPrompt],
    output_format: [format, (value) => setFormat(value as Music3Request['output_format'])],
    mp3_bitrate: [mp3Bitrate, setMp3Bitrate],
    peak_clip: [peakClip, setPeakClip],
  };
  useBridgeCommand('create_get', () => ({
    mode,
    fields: { ...Object.fromEntries(Object.entries(formFields).map(([key, [value]]) => [key, value])), instrumental, randomize_seed: randomizeSeed, adapters },
    request: buildRequest(),
    ready,
    error,
    assistant_writing: assisting,
  }));
  useBridgeCommand('create_set', (args) => {
    const fields = (args.fields && typeof args.fields === 'object' ? args.fields : args) as Record<string, unknown>;
    // every field is checked before any changes, so a refused call leaves the form as it was
    const extra = ['caption', 'mode', 'instrumental', 'randomize_seed', 'adapters'];
    const choices: Record<string, string[]> = { mode: ['studio', 'simple'], output_format: ['mp3', 'wav16', 'wav24', 'wav32'] };
    const unknown = Object.keys(fields).filter(key => !formFields[key] && !extra.includes(key));
    if (unknown.length) throw new Error(`Unknown fields: ${unknown.join(', ')}. The form has: ${[...Object.keys(formFields), ...extra].join(', ')}.`);
    for (const [key, allowed] of Object.entries(choices)) {
      if (key in fields && !allowed.includes(String(fields[key] ?? ''))) throw new Error(`${key} is one of: ${allowed.join(', ')}.`);
    }
    if ('caption' in fields && typeof fields.caption !== 'string') throw new Error('caption is text.');
    if ('adapters' in fields && !Array.isArray(fields.adapters)) throw new Error('adapters is a list of {id, scales}.');
    for (const [key, value] of Object.entries(fields)) {
      if (key === 'mode') setMode(value as 'simple' | 'studio');
      else if (key === 'caption') {
        // a whole caption goes into its three parts by their headings
        const parts = splitCaption(value as string);
        setGlobalMetadata(parts.globalMetadata);
        setVocalDetails(parts.vocalDetails);
        setArrangement(parts.arrangement);
      }
      else if (key === 'instrumental') setInstrumental(Boolean(value));
      else if (key === 'randomize_seed') setRandomizeSeed(Boolean(value));
      else if (key === 'adapters') setAdapters(value as AdapterUse[]);
      else formFields[key][1](value == null ? '' : String(value));
    }
    return { text: 'Filled in; create_form_get shows the form, ui_screenshot shows it on screen.' };
  });
  useBridgeCommand('create_submit', () => {
    submit();
    return { text: 'Pressed Create. studio_status shows the new job; if the form refused, create_form_get says why under error.' };
  });

  const totalTracks = numberOrUndefined(synthBatch) ?? 1;
  const roles: Array<{ key: string; label: string; options: string[] }> = [
    { key: 'lm_model', label: 'LM', options: catalog?.models?.lm ?? [] },
    { key: 'depth_model', label: 'Depth', options: catalog?.models?.depth ?? [] },
    { key: 'cond_model', label: 'Cond', options: catalog?.models?.cond ?? [] },
    { key: 'dit_model', label: 'DiT', options: catalog?.models?.dit ?? [] },
    { key: 'vae_model', label: 'VAE', options: catalog?.models?.vae ?? [] },
  ];

  const resetParameters = () => {
    setDuration(''); setLmSeed(''); setLmCfg(''); setLmTopK(''); setAudioCodes('');
    setSteps(''); setDitCfg(''); setSynthBatch(''); setSeed(''); setRandomizeSeed(true);
    setPeakClip(''); setMp3Bitrate('320'); setFormat('mp3'); setModels({});
  };

  const overBudget = promptTokens > MAX_PROMPT_TOKENS;

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-suno-panel dark:text-white">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain custom-scrollbar">
        <div className="space-y-3 p-4 pb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold">{t('createMusic')}</h1>
              <p className="mt-0.5 truncate text-[11px] text-zinc-500 dark:text-zinc-400">{t('localInference')}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${ready ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'}`}>
              <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${ready ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {serviceDown ? t('serviceUnavailable') : ready ? t('engineReady') : t('profileRequired')}
            </span>
          </div>

          {serviceDown ? (
            <div className="flex gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs leading-5 text-rose-700 dark:text-rose-200">
              <CircleAlert className="mt-0.5 shrink-0" size={15} />
              <div><b>{t('serviceUnavailable')}</b><br />{t('serviceUnavailableHint')}</div>
            </div>
          ) : !ready && (
            <div className="flex gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs leading-5 text-amber-800 dark:text-amber-200">
              <CircleAlert className="mt-0.5 shrink-0" size={15} />
              <div><b>{t('localGenerationUnavailable')}</b><br />{t('downloadProfileFirst')}</div>
            </div>
          )}

          <div className="flex items-center rounded-lg border border-zinc-300 bg-zinc-200 p-1 dark:border-white/5 dark:bg-black/40">
            {(['studio', 'simple'] as const).map(value => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${mode === value ? 'bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
              >
                {value === 'studio' ? t('studioMode') : t('simpleMode')}
              </button>
            ))}
          </div>

          {mode === 'simple' && !assistantReady && (
            <Card title={t('songIdea')}>
              <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t('assistantNeedsModel')}</p>
              <p className="mt-2 text-[11px] leading-4 text-zinc-500">{t('assistantHint')}</p>
              {/* Telling someone to go to Settings without a way to get there
                  is half an instruction. */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('mm3:open-settings', { detail: 'models:assistant' }))}
                className="mt-3 inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-pink-400 hover:text-pink-600 dark:border-white/15 dark:text-zinc-300"
              >
                <Settings2 size={13} />
                {t('setUpAssistant')}
              </button>
            </Card>
          )}

          {mode === 'simple' && assistantReady && (
            <Card title={t('songIdea')}>
              <AutoTextarea
                value={assistInstruction}
                minRows={3}
                onChange={event => setAssistInstruction(event.target.value)}
                placeholder={t('songIdeaPlaceholder')}
                className={`${CONTROL} resize-none`}
              />
              <p className="mt-2 text-[11px] leading-4 text-zinc-500">{t('songIdeaHint')}</p>
              <button
                type="button"
                onClick={() => void askAssistant('all')}
                disabled={assisting !== null || !assistInstruction.trim()}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 py-2.5 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-50"
              >
                {assisting === 'all' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                {assisting === 'all' ? `${t('assistantWriting')} · ${assistSeconds} ${t('secondsShort')}` : t('writeEverything')}
              </button>
              {assisting === 'all' && (
                <button
                  type="button"
                  onClick={stopAssistant}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 py-2 text-xs font-semibold text-zinc-600 transition-colors hover:border-rose-400 hover:text-rose-600 dark:border-white/15 dark:text-zinc-300"
                >
                  <Square size={13} />
                  {t('cancelDownload')}
                </button>
              )}
            </Card>
          )}


          {activity.filter(entry => entry.state !== 'done').slice(-3).map(entry => (
            <div key={`${entry.song_id}-${entry.kind}`} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-[11px] dark:border-white/10 dark:bg-suno-card">
              <div className="flex items-center gap-2">
                {entry.state === 'running'
                  ? <Loader2 size={12} className="animate-spin text-pink-500" />
                  : <AlertTriangle size={12} className="text-amber-500" />}
                <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                  {entry.kind === 'cover' ? t('activityCover') : t('activityKaraoke')}
                </span>
                <span className="min-w-0 flex-1 truncate text-zinc-500">{entry.title}</span>
              </div>
              {entry.detail && <p className="mt-1 break-words text-[11px] leading-4 text-amber-600 dark:text-amber-300">{karaokeReason(t, entry.detail)}</p>}
            </div>
          ))}

          {assisting !== null && (
            <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-suno-card">
              <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wide">
                <span className="flex items-center gap-1.5 text-pink-600 dark:text-pink-300">
                  <Loader2 size={12} className="animate-spin" />
                  {assistStage === 'preparing' && t('assistStagePreparing')}
                  {assistStage === 'sent' && t('assistStageSent')}
                  {assistStage === 'writing' && t('assistStageWriting')}
                  {assistStage === 'done' && t('assistStageDone')}
                  {!assistStage && t('assistStagePreparing')}
                </span>
                <span className="flex items-center gap-2">
                  <span className="tabular-nums text-zinc-400">{assistSeconds} {t('secondsShort')}</span>
                  <button type="button" onClick={stopAssistant} className={ICON} title={t('cancelDownload')}><X size={13} /></button>
                </span>
              </div>
              {assistModel && <p className="mt-1 truncate text-[11px] text-zinc-500">{assistModel}</p>}
              {assistDraft && (
                <pre className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap break-words rounded-lg bg-zinc-50 p-2 font-mono text-[11px] leading-4 text-zinc-600 dark:bg-black/30 dark:text-zinc-300">
                  {assistDraft.slice(-1200)}
                </pre>
              )}
            </div>
          )}

          {/* Only for the icon buttons in the card headers: the big button
              already says it in words. */}
          {(assisting === 'lyrics' || assisting === 'prompt') && (
            <div className="flex items-center gap-2 rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 py-2 text-xs text-pink-700 dark:text-pink-200">
              <Loader2 size={14} className="animate-spin" />
              <span>{t('assistantWriting')} · {assistSeconds} {t('secondsShort')}</span>
            </div>
          )}

          <Card
            title={t('captionStructured')}
            actions={
              <>
                <button type="button" onClick={() => (assistantReady ? void askAssistant('prompt') : openAssistantSetup())} disabled={assistantReady && (assisting !== null)} className={ICON} title={assistantReady ? t('writeCaption') : t('setUpAssistant')}>
                  {assisting === 'prompt' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} className="text-pink-500" />}
                </button>
                <button type="button" onClick={loadExample} className={ICON} title={t('examplePrompt')}><Dices size={14} /></button>
                <button type="button" onClick={() => promptFile.current?.click()} className={ICON} title={t('openPrompt')}><FolderOpen size={14} /></button>
                <button type="button" onClick={savePrompt} className={ICON} title={t('savePrompt')}><Save size={14} /></button>
                <button type="button" onClick={reset} className={ICON} title={t('resetPrompt')}><RotateCcw size={14} /></button>
                <input
                  ref={promptFile}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={event => { const file = event.target.files?.[0]; if (file) void openPrompt(file); event.target.value = ''; }}
                />
              </>
            }
          >
            <input
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder={t('untitled')}
              className="w-full border-0 bg-transparent p-0 text-lg font-bold text-zinc-900 outline-none placeholder:text-zinc-300 dark:text-white dark:placeholder:text-zinc-600"
            />
            <p className="mb-3 mt-1 text-[11px] leading-4 text-zinc-500">{t('captionStructuredHint')}</p>
            <div className="mb-3 border-b border-zinc-100 pb-3 dark:border-white/5">
              <Switch checked={instrumental} onChange={setInstrumental} label={t('instrumental')} hint={t('instrumentalHint')} />
            </div>
            <div className="space-y-2">
              <Pane label={t('globalMetadata')} value={globalMetadata} onChange={setGlobalMetadata} placeholder={t('globalMetadataPlaceholder')} />
              <Pane label={t('vocalDetails')} value={vocalDetails} onChange={setVocalDetails} placeholder={t('vocalDetailsPlaceholder')} />
              <Pane label={t('arrangementSection')} value={arrangement} onChange={setArrangement} placeholder={t('arrangementPlaceholder')} />
            </div>
          </Card>

          <Card
            title={t('lyrics')}
            actions={
              <>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ${overBudget ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300' : 'bg-zinc-200/70 text-zinc-500 dark:bg-white/10 dark:text-zinc-400'}`}
                  title={`${t('promptBudget')} — ${t('caption')}: ${estimateTokens(caption)}, ${t('lyrics')}: ${estimateTokens(lyrics)}`}
                >
                  {t('promptBudgetShort')} {promptTokens} / {MAX_PROMPT_TOKENS}
                </span>
                <button type="button" onClick={() => (assistantReady ? void layOutLyrics() : openAssistantSetup())} disabled={assistantReady && (assisting !== null || !lyrics.trim())} className={ICON} title={assistantReady ? t('formatLyrics') : t('setUpAssistant')}>
                  {assisting === 'sections' ? <Loader2 size={14} className="animate-spin" /> : <Tags size={14} />}
                </button>
                <button type="button" onClick={() => (assistantReady ? void askAssistant('lyrics') : openAssistantSetup())} disabled={assistantReady && (assisting !== null)} className={ICON} title={assistantReady ? t('writeLyrics') : t('setUpAssistant')}>
                  {assisting === 'lyrics' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} className="text-pink-500" />}
                </button>
                <button type="button" onClick={() => setLyrics('')} className={ICON} title={t('resetPrompt')}><RotateCcw size={14} /></button>
              </>
            }
          >
            <AutoTextarea
              value={lyrics}
              minRows={10}
              onChange={event => setLyrics(event.target.value)}
              placeholder={'[intro]\n\n[verse]\n…\n\n[chorus]\n…'}
              className={`${CONTROL} resize-none font-mono text-xs leading-5`}
            />
            <p className="mt-2 text-[11px] leading-4 text-zinc-500">{t('lyricsHint')}</p>
            {overBudget && <p className="mt-1 text-[11px] leading-4 text-rose-600 dark:text-rose-300">{t('promptTooLong')}</p>}
          </Card>

          <AdapterPicker
            value={adapters}
            onChange={setAdapters}
            onTrigger={applyTrigger}
            iconClass={ICON}
            frame={(title, _icon, actions, body) => <Card title={title} actions={actions}>{body}</Card>}
          />

          <Card
            title={t('quality')}
            actions={
              <button type="button" onClick={resetParameters} className="rounded-md px-2 py-1 text-[10px] font-semibold text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-black dark:hover:bg-white/10 dark:hover:text-white">
                {t('resetToDefaults')}
              </button>
            }
          >
            <div className="space-y-3">
              <SliderRow
                label={t('maxDuration')}
                value={duration}
                fallback={Number(defaults.duration ?? 60)}
                min={10}
                max={MAX_DURATION_SECONDS}
                step={5}
                suffix=" s"
                onChange={setDuration}
              />
              <p className="text-[11px] leading-4 text-zinc-500">{t('maxDurationHint')}</p>
              <SliderRow
                label={t('ditSteps')}
                value={steps}
                fallback={Number(defaults.steps ?? 30)}
                min={8}
                max={80}
                step={1}
                onChange={setSteps}
              />
              <SliderRow
                label={t('cfgScale')}
                value={ditCfg}
                fallback={Number(defaults.dit_cfg ?? 1.7)}
                min={1}
                max={5}
                step={0.1}
                onChange={setDitCfg}
              />
            </div>

            <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4 dark:border-white/5">
              {/* No batch slider. The engine reserves KV cache for the whole
                  batch when it loads its weights and takes the number only as a
                  launch flag, so a control here could not change anything about
                  the run it appears in. */}
              <SliderRow
                label={t('variationsBatch')}
                value={synthBatch}
                fallback={Number(defaults.synth_batch_size ?? 1)}
                min={1}
                max={4}
                step={1}
                onChange={setSynthBatch}
              />
              <Switch checked={randomizeSeed} onChange={setRandomizeSeed} label={t('randomizeSeed')} />
              {!randomizeSeed && (
                <Field label={t('seedShort')}>
                  <input value={seed} onChange={event => setSeed(event.target.value)} placeholder={placeholder('seed')} inputMode="numeric" className={CONTROL} />
                </Field>
              )}
              {totalTracks > 1 && (
                <p className="text-[11px] text-zinc-500">{t('renderCountPrefix')} <b className="text-zinc-700 dark:text-zinc-200">{totalTracks}</b></p>
              )}
            </div>
          </Card>

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-white/5 dark:bg-suno-card">
            <button
              type="button"
              onClick={() => setShowAdvanced(current => !current)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
            >
              {t('advanced')}
              <ChevronDown size={15} className={showAdvanced ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
            {showAdvanced && (
              <div className="space-y-4 border-t border-zinc-100 p-3 dark:border-white/5">
                <Stage title={t('stageLm')} hint={t('stageLmHint')}>
                  <div className="space-y-3">
                    <SliderRow
                      label={t('cfgScale')}
                      value={lmCfg}
                      fallback={Number(defaults.lm_cfg ?? 1.5)}
                      min={1}
                      max={5}
                      step={0.1}
                      onChange={setLmCfg}
                    />
                    <SliderRow
                      label={t('topK')}
                      value={lmTopK}
                      fallback={Number(defaults.lm_top_k ?? 50)}
                      min={1}
                      max={200}
                      step={1}
                      onChange={setLmTopK}
                    />
                    <Field label={t('lmSeedShort')}>
                      <input value={lmSeed} onChange={event => setLmSeed(event.target.value)} placeholder={placeholder('lm_seed')} inputMode="numeric" className={CONTROL} />
                    </Field>
                  </div>
                </Stage>

                <div className="border-t border-zinc-100 pt-4 dark:border-white/5">
                  <Stage title={t('stageOutput')} hint={t('stageOutputHint')}>
                  <SliderRow
                    label={t('peakClipLabel')}
                    value={peakClip}
                    fallback={Number(defaults.peak_clip ?? 10)}
                    min={0}
                    max={30}
                    step={1}
                    onChange={setPeakClip}
                  />
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Field label={t('mp3Bitrate')}>
                      <select value={mp3Bitrate || String(defaults.mp3_bitrate ?? 320)} onChange={event => setMp3Bitrate(event.target.value)} disabled={format !== 'mp3'} className={CONTROL}>
                        {['128', '192', '256', '320'].map(rate => <option key={rate} value={rate}>{rate} kbps</option>)}
                      </select>
                    </Field>
                    <Field label={t('outputFormat')}>
                      <select value={format} onChange={event => setFormat(event.target.value as Music3Request['output_format'])} className={CONTROL}>
                        <option value="mp3">MP3</option>
                        <option value="wav16">WAV16</option>
                        <option value="wav24">WAV24</option>
                        <option value="wav32">WAV32</option>
                      </select>
                    </Field>
                  </div>
                  <p className="mt-2 text-[11px] leading-4 text-zinc-500">{t('peakClipHint')}</p>
                  </Stage>
                </div>

                <div className="border-t border-zinc-100 pt-4 dark:border-white/5">
                  <Stage title={t('componentOverride')} hint={t('componentOverrideHint')}>
                  <div className="space-y-2">
                    {roles.map(role => (
                      <div key={role.key} className="grid grid-cols-[64px_1fr] items-center gap-2">
                        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">{role.label}</span>
                        <select
                          value={models[role.key] ?? ''}
                          onChange={event => setModels(current => {
                            const next = { ...current };
                            if (event.target.value) next[role.key] = event.target.value;
                            else delete next[role.key];
                            return next;
                          })}
                          className={CONTROL}
                        >
                          <option value="">
                            {(() => {
                              // Name the file the profile actually loads: "profile
                              // default" beside every role told the user nothing.
                              const inUse = setup?.profile_files?.[role.key as keyof ProfileFiles];
                              return inUse ? `${t('profileDefault')} · ${inUse.replace('MiniMax-Music3-', '')}` : t('profileDefault');
                            })()}
                          </option>
                          {role.options.map(option => <option key={option} value={option}>{option.replace('MiniMax-Music3-', '')}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  {Object.keys(models).length > 0 && Object.keys(models).length < 5 && (
                    <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-300">{t('componentOverridePartial')}</p>
                  )}
                  </Stage>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('mm3:open-settings', { detail: 'models' }))}
              className="text-left hover:text-pink-500"
              title={t('changeProfileHint')}
            >
              {t('profile')}: <b className="text-zinc-700 underline decoration-dotted underline-offset-2 dark:text-zinc-200">{profileLabel}</b>
            </button>
            <button type="button" onClick={() => void refreshSetup().catch(() => undefined)} className="hover:text-pink-500">{t('refresh')}</button>
          </div>
          {setup?.hardware?.reason && <p className="px-1 text-[10px] text-zinc-400">{setup.hardware.reason}</p>}
          {error && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs leading-5 text-red-700 dark:text-red-200">{error}</div>}
        </div>
      </div>

      <footer className="shrink-0 border-t border-zinc-200 bg-zinc-50/95 p-4 backdrop-blur dark:border-white/5 dark:bg-suno-panel/95">
        <button
          type="button"
          onClick={submit}
          disabled={activeJobCount >= 10}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-base font-bold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? <Square size={18} /> : <Sparkles size={18} />}
          {t('create')}
          {activeJobCount > 0 && <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{activeJobCount}/10</span>}
        </button>
      </footer>
    </section>
  );
};
