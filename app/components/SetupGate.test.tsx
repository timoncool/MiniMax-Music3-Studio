import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OptionalGroup } from './SetupGate';

vi.mock('../context/I18nContext', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock('../services/studioQueries', () => ({ openRouterSettingsChanged: vi.fn(), SELF_READ: { 'x-hub-skip': '1' } }));
vi.mock('./AssistantSettings', () => ({ AssistantExtras: () => null }));
vi.mock('./KaraokeSettings', () => ({ KaraokeExtras: () => null }));
vi.mock('./HubTelemetryPreview', () => ({ HubTelemetryPreview: () => null }));
vi.mock('./AssistantRules', () => ({ AssistantRules: () => null }));
vi.mock('../services/studioHub', () => ({ setTelemetry: vi.fn() }));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let host: HTMLDivElement;
let statusCalls: number;
let status: Record<string, unknown>;

const response = (body: unknown, code = 200): Response => ({
  ok: code >= 200 && code < 300, status: code, json: async () => body,
}) as Response;

async function mount() {
  statusCalls = 0;
  status = {
    provider: 'managed', runtime: 'cpu', chosen_model: 'text-model',
    assets: [{ id: 'text-model', label: 'Text model', kind: 'model', bytes: 1000, installed: false }],
  };
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    if (url === '/status') {
      statusCalls++;
      // a poll that asks again with no pause would never stop on its own
      if (statusCalls > 200) throw new Error('the status is asked without a pause');
      // every answer is a new object, as JSON from the service always is
      return response(structuredClone(status));
    }
    return response({ started: true });
  }));
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  await act(async () => root.render(<OptionalGroup title="Writing assistant" purpose="Write songs" statusUrl="/status" installUrl="/install" cancelUrl="/cancel" engines={[{ id: 'managed', label: 'Text engine' }]} />));
  await act(async () => host.querySelector<HTMLButtonElement>('button')!.click());
}

afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('optional capability installation', () => {
  it('asks for a running download at most once a pause, though every answer is a new object', async () => {
    vi.useFakeTimers();
    await mount();
    status.active_download = { asset_id: 'text-model', downloaded_bytes: 25, total_bytes: 1000, done: false };
    await act(async () => host.querySelector<HTMLButtonElement>('button[title="download"]')!.click());
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    const settled = statusCalls;
    await act(async () => { await vi.advanceTimersByTimeAsync(3000); });
    expect(statusCalls - settled).toBeLessThanOrEqual(3);
    expect(statusCalls).toBeLessThan(20);
  });
});
