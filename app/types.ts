export interface Song {
  /** A track a tool made from another: which one, by which tool, how. */
  derived?: { from: string; fromTitle: string; tool: string; settings?: Record<string, unknown> } | null;
  id: string;
  title: string;
  lyrics: string;
  style: string;
  coverUrl: string;
  /** The page a cover photograph came from and the terms it is under. */
  coverSource?: string;
  /** Set while the cover is the look's placeholder, not one of the track's own. */
  coverPlaceholder?: string;
  duration: string;
  createdAt: Date;
  isGenerating?: boolean;
  /** The engine job a generation's row follows. */
  jobId?: string;
  /** The playlist the song being made goes into. */
  playlistId?: string;
  /** The job that made a library song; its row becomes this song. */
  madeByJob?: string;
  /** The list row this item is drawn in, when it took over another item's row. */
  viewKey?: string;
  queuePosition?: number; // Position in queue (undefined = actively generating, number = waiting in queue)
  progress?: number;
  stage?: string;
  /** The running stage's counter, e.g. `57/64 · ~2:50`. */
  stageDetail?: string;
  generationParams?: any;
  tags: string[];
  audioUrl?: string;
  /** The thumbs-up, kept with the song in the library. */
  liked?: boolean;
  /** When it was liked: the liked list is read from the latest. */
  likedAt?: Date;
  isPublic?: boolean;
  likeCount?: number;
  viewCount?: number;
  userId?: string;
  creator?: string;
  creator_avatar?: string;
  ditModel?: string;
  lmModel?: string;
  lmBackend?: string;
  openrouterModel?: string | null;
  generationTime?: number;
  lrcContent?: string;
  bpm?: number;
  keyScale?: string;
  timeSignature?: string;
  /** Native Music3 provenance is complete enough for POST /v1/music/replay. */
  nativeReplayAvailable?: boolean;
  /** Processed versions kept beside the original; the active one plays. */
  audioVersions?: SongVersion[];
  /** `original`, a version id, or absent for a track never processed. */
  activeVersion?: string;
}

export interface SongVersion {
  id: string;
  label: string;
  createdAt: string;
  settings?: Record<string, unknown>;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  cover_url?: string;
  songIds?: string[];
  isPublic?: boolean;
  is_public?: boolean;
  user_id?: string;
  creator?: string;
  created_at?: string;
  song_count?: number;
  songs?: any[];
}

export interface Comment {
  id: string;
  songId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

/**
 * The exact MiniMax Music3 request the native server accepts. Field names match
 * `/v1/music/jobs`, which in turn mirrors the `MM3Request` struct in the pinned
 * minimaxmusic.cpp: there is no translation layer that could silently drop a
 * control, and anything not listed here is not a real engine parameter.
 */
export interface Music3Request {
  caption: string;
  lyrics: string;
  duration_seconds: number;
  steps: number;
  /** DiT (flow-matching) noise seed. Omit for a random seed. */
  seed?: number;
  /** Autoregressive language-model seed. Omit for a random seed. */
  lm_seed?: number;
  lm_cfg: number;
  lm_top_k: number;
  /** Songs sampled from this prompt, each with its own LM stream. */
  lm_batch_size: number;
  /** Flow-matching variations per song, 1..9. */
  synth_batch_size: number;
  dit_cfg: number;
  output_format: 'flac' | 'mp3';
  mp3_bitrate: number;
  /** Library title only — never sent to the engine. */
  title?: string;
  /** LoRA adapters for this song, each with a strength per engine slot. */
  adapters?: { id: string; scales: Record<string, number> }[];
  /** The playlist the made songs are added to: a project being worked on. */
  playlist_id?: string;
}

/** A song as the library stores and lists it. */
export interface NativeLibrarySong {
  id: string;
  title: string;
  audio_path?: string | null;
  caption: string;
  lyrics: string;
  metadata?: Record<string, unknown> | null;
  generation_settings?: Record<string, unknown> | null;
  engine_id: string;
  profile_id?: string | null;
  replay_request?: unknown | null;
  audio_codes?: unknown | null;
  created_at: string;
  updated_at?: string;
}

export interface Music3JobSong {
  id: string;
  audio_url: string;
  /** The library's record of the song, as the library lists it. */
  song: NativeLibrarySong;
}

export interface Music3Job {
  id: string;
  /** The mark this window gave the request; an agent's job has none. */
  client_ref?: string;
  /** When the service took the request, in Unix milliseconds. */
  submitted_at: number;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  phase: string;
  message: string;
  title?: string;
  caption: string;
  lyrics: string;
  duration_seconds: number;
  generation_settings: Record<string, unknown>;
  playlist_id?: string;
  song?: Music3JobSong;
  songs?: Music3JobSong[];
}

/** How far the engine is with the job it renders, as the service reads its log. */
export interface Music3Progress {
  stage: 'frames' | 'diffusion';
  fraction: number;
  detail: string;
}


export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
}

export interface User {
  id: string;
  username: string;
  createdAt: Date;
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  isAdmin?: boolean;
  avatar_url?: string;
  banner_url?: string;
}

export interface UserProfile {
  user: User;
  publicSongs: Song[];
  publicPlaylists: Playlist[];
  stats: {
    totalSongs: number;
    totalLikes: number;
  };
}

// Simplified views for ACE-Step UI
export type View = 'create' | 'library' | 'tools' | 'adapters' | 'playlist' | 'search' | 'news';
