# Drummer PC

A modern, web-based drum machine and sequencer. 

## Overview

The application is built with Vite, React, and TypeScript, utilizing Tone.js for the core audio engine.

### Features
- **AudioEngine (Tone.js):** Uses `Tone.Players` instances, loaded dynamically from the `DRUM_SAMPLES` constants catalog which contains 49 .wav files (Kicks, Snares, Hats, Percs, Cymbals, Toms) pulled from the `stargate-sample-pack`. Includes Master Volume, Tape Distortion plugins, and Swing offsets.
- **Zustand Orchestrator:** State tracks 6 patterns of 16 steps along with dynamic track array configurations.
- **UI Interaction:** The interface features a sleek, modern studio drum machine design with deep brushed-metal backgrounds, precise hardware button styling, neon active-state highlights, and an optimized, compact layout.
- **Track Selection & Additions:** Click any track's row header to open a dropdown sample picker. Swap samples mid-playback or use the "Add Track" button at the bottom of the sequencer to add an entirely new lane (and sound) into your sequence block.
- **Transport & Storage:** Includes Save and Load functionality (`Ctrl+S`, `Ctrl+O`) and spacebar transport controls.
- **Step Modifiers:** Shift-click to toggle Ratcheting sub-hits, Alt-click to toggle triplets.
- **Kit Generation:** Features a `RND KIT` button to randomly load a fresh sample kit.
- **Metronome:** Includes a click track Metronome toggle.
- **Presets:** 20 built-in drum patterns categorized into Rock, Pop, Disco, and Rap. Load via the "PRESETS" dropdown to automatically overwrite the current pattern and set the optimal genre tempo.
- **Audio Export:** Tone.js `Recorder` intercepts the main output allowing the 'P' button to extract your generated loops into `.webm` audio files instantly.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser to [http://localhost:5173/](http://localhost:5173/).

## Future Enhancements
- Continued improvements to audio engine timing and swing.
- Expanded keyboard interactivity (Hotkeys mapping to UI behaviors).
