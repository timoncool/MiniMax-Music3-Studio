import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { I18nProvider } from '../context/I18nContext';
import { en } from '../i18n/en';
import { EngineSettings } from './EngineSettings';

const setup = vi.hoisted(() => ({ platform: '', hardware: { onProcessor: true } }));
vi.mock('../services/studioQueries', () => ({
  SELF_READ: {},
  useSetupStatus: () => ({ data: setup }),
}));

it.each([
  ['macos', ['auto', 'cpu'], en.computeBackendHint_mac, en.songsOnProcessorMac],
  ['windows', ['auto', 'cuda', 'vulkan', 'cpu'], en.computeBackendHint_auto, en.songsOnProcessor],
] as const)('shows the engine controls and processor guidance for %s', async (platform, backends, hint, warning) => {
  setup.platform = platform;
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({})));
  localStorage.setItem('language', 'en');
  const host = document.createElement('div');
  const root = createRoot(host);
  try {
    await act(async () => root.render(<I18nProvider><EngineSettings /></I18nProvider>));
    const buttons = [...host.querySelectorAll('[role="radio"]')];
    expect(buttons.map(button => button.textContent)).toEqual(backends.map(backend => en[`computeBackend_${backend}`]));
    expect(host.textContent).toContain(hint);
    expect(host.textContent).toContain(warning);
    if (platform === 'macos') expect(host.textContent).not.toContain(en.computeBackendHint_auto);
  } finally {
    act(() => root.unmount());
    vi.unstubAllGlobals();
    localStorage.removeItem('language');
  }
});
