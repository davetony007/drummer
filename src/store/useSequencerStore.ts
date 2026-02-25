import { create } from 'zustand';
import { engine } from '../audio/Engine';
import { DRUM_SAMPLES, SampleCategory } from '../constants/samples';
import { PresetData } from '../constants/presets';
import { SongStructure } from '../constants/songStructures';

export type PatternId = 1 | 2 | 3 | 4 | 5 | 6;
export type LoopState = 'L' | 2 | 4 | 8 | 16;

export interface StepData {
    active: boolean;
    velocity: number; // 1-4
    ratchet: number; // 1-4
    triplet: boolean;
}

export interface TrackData {
    id: string; // Unique ID for the track row
    name: string; // Display name e.g. "Kick"
    category: SampleCategory; // The sample type
    sampleUrl: string; // The active wave file
    gain: number; // 0-1
    pan: number; // -1 to 1
    steps: StepData[];
}

export interface PatternData {
    id: PatternId;
    tracks: TrackData[];
    loopState: LoopState;
}

export interface AppState {
    // Transport
    isPlaying: boolean;
    isRecording: boolean;
    tempo: number;
    masterVolume: number;
    tapeDistortion: number;
    swing: number;
    jank: number; // 0-9
    isMetronomeEnabled: boolean;
    autoFill: number; // 0, 4, 8

    // Patterns
    activePatternId: PatternId;
    patterns: Record<PatternId, PatternData>;

    // Seq State
    currentStep: number;

    // Song Mode
    songMode: boolean;
    patternChain: PatternId[];
    currentChainIndex: number;

    // Actions
    togglePlay: () => void;
    toggleRecording: () => void;
    toggleMetronome: () => void;
    setTempo: (bpm: number) => void;
    setMasterVolume: (val: number) => void;
    setTapeDistortion: (val: number) => void;
    setSwing: (val: number) => void;
    setJank: (val: number) => void;
    cycleAutoFill: () => void;
    setTrackVolume: (trackId: string, gain: number) => void;
    setTrackPan: (trackId: string, pan: number) => void;
    setActivePattern: (id: PatternId) => void;
    duplicatePattern: () => void;
    generatePattern: () => void;
    toggleStep: (patternId: PatternId, trackId: string, stepIndex: number, velocity?: number, ratchet?: number, triplet?: boolean) => void;
    setCurrentStep: (step: number) => void;
    addTrack: () => void;
    removeTrack: (trackId: string) => void;
    changeTrackSample: (trackId: string, newSampleUrl: string, sampleName: string, category: SampleCategory) => void;
    saveState: () => void;
    loadState: () => void;
    randomizeKit: (patternId?: PatternId) => void;
    loadPreset: (preset: PresetData) => void;

    // Song Mode Actions
    setSongMode: (active: boolean) => void;
    addToChain: (id: PatternId) => void;
    removeFromChain: (index: number) => void;
    clearChain: () => void;
    loadSongChain: (chain: PatternId[]) => void;
    loadSongPreset: (preset: SongStructure) => void;
    prepareNextPatternInChain: () => void;
}

const createEmptySteps = (): StepData[] =>
    Array(16).fill(null).map(() => ({ active: false, velocity: 3, ratchet: 1, triplet: false }));

const getRandomSample = (category: SampleCategory) => {
    const samples = DRUM_SAMPLES[category];
    return samples[Math.floor(Math.random() * samples.length)];
};

const createEmptyPattern = (id: PatternId): PatternData => {
    const kick = getRandomSample('kick');
    const snare = getRandomSample('snare');
    const hihat = getRandomSample('hihat');
    const perc1 = getRandomSample('perc');
    const perc2 = getRandomSample('perc');

    return {
        id,
        loopState: 'L',
        tracks: [
            { id: 'track-1', name: kick.label, category: 'kick', sampleUrl: kick.url, gain: 0.8, pan: 0, steps: createEmptySteps() },
            { id: 'track-2', name: snare.label, category: 'snare', sampleUrl: snare.url, gain: 0.8, pan: 0, steps: createEmptySteps() },
            { id: 'track-3', name: hihat.label, category: 'hihat', sampleUrl: hihat.url, gain: 0.8, pan: 0, steps: createEmptySteps() },
            { id: 'track-4', name: perc1.label, category: 'perc', sampleUrl: perc1.url, gain: 0.8, pan: 0, steps: createEmptySteps() },
            { id: 'track-5', name: perc2.label, category: 'perc', sampleUrl: perc2.url, gain: 0.8, pan: 0, steps: createEmptySteps() },
        ]
    };
};

const initialPatterns: Record<PatternId, PatternData> = {
    1: createEmptyPattern(1),
    2: createEmptyPattern(2),
    3: createEmptyPattern(3),
    4: createEmptyPattern(4),
    5: createEmptyPattern(5),
    6: createEmptyPattern(6),
};

// Add a basic 4-on-the-floor to Pattern 1 for testing
[0, 4, 8, 12].forEach(i => initialPatterns[1].tracks[0].steps[i].active = true);
[4, 12].forEach(i => initialPatterns[1].tracks[1].steps[i].active = true);
[0, 2, 4, 6, 8, 10, 12, 14].forEach(i => initialPatterns[1].tracks[2].steps[i].active = true);


export const useSequencerStore = create<AppState>()((set, get) => ({
    isPlaying: false,
    isRecording: false,
    tempo: 120,
    masterVolume: 0.8,
    tapeDistortion: 0,
    swing: 0,
    jank: 0,
    isMetronomeEnabled: false,
    autoFill: 0,

    activePatternId: 1,
    patterns: initialPatterns,
    currentStep: 0,

    songMode: false,
    patternChain: [],
    currentChainIndex: 0,

    togglePlay: () => {
        set(state => {
            const next = !state.isPlaying;
            if (next) engine.initialize().then(() => engine.startTransport());
            else engine.stopTransport();
            return { isPlaying: next, currentStep: next ? state.currentStep : 0, currentChainIndex: next ? 0 : state.currentChainIndex };
        });
    },

    toggleRecording: () => {
        engine.toggleRecording().then(isRec => set({ isRecording: isRec }));
    },

    toggleMetronome: () => set(state => ({ isMetronomeEnabled: !state.isMetronomeEnabled })),

    setTempo: (bpm) => {
        engine.setTempo(bpm);
        set({ tempo: bpm });
    },

    setMasterVolume: (val) => {
        engine.setMasterVolume(val);
        set({ masterVolume: val });
    },

    setTapeDistortion: (val) => {
        engine.setTapeDistortion(val);
        set({ tapeDistortion: val });
    },

    setJank: (val) => set({ jank: val }),

    cycleAutoFill: () => set(state => {
        if (state.autoFill === 0) return { autoFill: 4 };
        if (state.autoFill === 4) return { autoFill: 8 };
        return { autoFill: 0 };
    }),

    setSwing: (val) => {
        engine.setSwing(val);
        set({ swing: val });
    },

    setTrackVolume: (trackId, gain) => set(state => {
        const patterns = { ...state.patterns };
        Object.values(patterns).forEach(pattern => {
            const trackIndex = pattern.tracks.findIndex(t => t.id === trackId);
            if (trackIndex !== -1) {
                pattern.tracks[trackIndex] = { ...pattern.tracks[trackIndex], gain };
            }
        });
        engine.updateTracks(patterns[state.activePatternId].tracks);
        return { patterns };
    }),

    setTrackPan: (trackId, pan) => set(state => {
        const patterns = { ...state.patterns };
        Object.values(patterns).forEach(pattern => {
            const trackIndex = pattern.tracks.findIndex(t => t.id === trackId);
            if (trackIndex !== -1) {
                pattern.tracks[trackIndex] = { ...pattern.tracks[trackIndex], pan };
            }
        });
        engine.updateTracks(patterns[state.activePatternId].tracks);
        return { patterns };
    }),

    setActivePattern: (id) => set({ activePatternId: id }),

    duplicatePattern: () => set(state => {
        const currentPattern = state.patterns[state.activePatternId];
        const nextId = (state.activePatternId === 6 ? 1 : state.activePatternId + 1) as PatternId;
        const newPatterns = { ...state.patterns };
        // Deep clone tracks
        newPatterns[nextId] = {
            ...currentPattern,
            id: nextId,
            tracks: JSON.parse(JSON.stringify(currentPattern.tracks))
        };
        return { patterns: newPatterns, activePatternId: nextId };
    }),

    generatePattern: () => set(state => {
        const patterns = { ...state.patterns };
        const pattern = { ...patterns[state.activePatternId] };

        // Clear existing steps by copying empty tracks structure but keeping current samples/ids
        const tracks = pattern.tracks.map(t => ({ ...t, steps: createEmptySteps() }));

        // Randomly generate a beat assuming Track 0 is Kick, Track 1 is Snare, Track 2 is Hats
        if (tracks.length > 0) {
            tracks[0].steps[0].active = true;
            tracks[0].steps[Math.random() > 0.5 ? 8 : 10].active = true;
            if (Math.random() > 0.7) tracks[0].steps[14].active = true;
        }

        if (tracks.length > 1) {
            tracks[1].steps[4].active = true;
            tracks[1].steps[12].active = true;
        }

        if (tracks.length > 2) {
            const hhPattern = Math.random() > 0.5 ? 'eighths' : 'sixteenths';
            for (let i = 0; i < 16; i++) {
                if (hhPattern === 'eighths' && i % 2 === 0) tracks[2].steps[i].active = true;
                else if (hhPattern === 'sixteenths') tracks[2].steps[i].active = Math.random() > 0.3;
            }
        }

        // Random fills for remaining tracks
        for (let tIdx = 3; tIdx < tracks.length; tIdx++) {
            for (let i = 0; i < 16; i++) {
                if (Math.random() > 0.85) tracks[tIdx].steps[i].active = true;
            }
        }

        pattern.tracks = tracks;
        patterns[state.activePatternId] = pattern;
        return { patterns };
    }),

    toggleStep: (patternId, trackId, stepIndex, velocity = 3, ratchet = 1, triplet = false) => {
        set(state => {
            const patterns = { ...state.patterns };
            const pattern = { ...patterns[patternId] };

            const trackIndex = pattern.tracks.findIndex(t => t.id === trackId);
            if (trackIndex === -1) return state;

            const tracks = [...pattern.tracks];
            const track = { ...tracks[trackIndex] };
            const steps = [...track.steps];

            const step = { ...steps[stepIndex] };
            step.active = !step.active;

            if (step.active) {
                step.velocity = velocity;
                step.ratchet = ratchet;
                step.triplet = triplet;
            }

            steps[stepIndex] = step;
            track.steps = steps;
            tracks[trackIndex] = track;
            pattern.tracks = tracks;
            patterns[patternId] = pattern;

            return { patterns };
        });
    },

    setCurrentStep: (step) => set({ currentStep: step }),

    addTrack: () => set(state => {
        const patterns = { ...state.patterns };
        // Add to all patterns so sequence lengths stay consistent
        Object.values(patterns).forEach(pattern => {
            const newTrackId = `track-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            pattern.tracks = [
                ...pattern.tracks,
                {
                    id: newTrackId,
                    name: DRUM_SAMPLES.perc[0].label,
                    category: 'perc',
                    sampleUrl: DRUM_SAMPLES.perc[0].url,
                    gain: 0.8,
                    pan: 0,
                    steps: createEmptySteps()
                }
            ];
        });

        // Notify engine to update samplers
        engine.updateTracks(patterns[state.activePatternId].tracks);
        return { patterns };
    }),

    removeTrack: (trackId) => set(state => {
        const patterns = { ...state.patterns };
        Object.values(patterns).forEach(pattern => {
            pattern.tracks = pattern.tracks.filter(t => t.id !== trackId);
        });

        engine.updateTracks(patterns[state.activePatternId].tracks);
        return { patterns };
    }),

    changeTrackSample: (trackId, newSampleUrl, sampleName, category) => set(state => {
        const patterns = { ...state.patterns };
        Object.values(patterns).forEach(pattern => {
            const trackIndex = pattern.tracks.findIndex(t => t.id === trackId);
            if (trackIndex !== -1) {
                pattern.tracks[trackIndex] = {
                    ...pattern.tracks[trackIndex],
                    sampleUrl: newSampleUrl,
                    name: sampleName,
                    category: category
                }
            }
        });
        engine.updateTracks(patterns[state.activePatternId].tracks);
        return { patterns };
    }),

    randomizeKit: (targetPatternId?: PatternId) => set(state => {
        const patterns = { ...state.patterns };
        // Randomize the active pattern by default, unless specified
        const idToUpdate = targetPatternId || state.activePatternId;
        const pattern = { ...patterns[idToUpdate] };

        pattern.tracks = pattern.tracks.map(track => {
            const newSample = getRandomSample(track.category);
            return {
                ...track,
                name: newSample.label,
                sampleUrl: newSample.url
            }
        });

        patterns[idToUpdate] = pattern;
        if (state.activePatternId === idToUpdate) {
            engine.updateTracks(pattern.tracks);
        }
        return { patterns };
    }),

    loadPreset: (preset) => set(state => {
        const patterns = { ...state.patterns };
        const pattern = { ...patterns[state.activePatternId] };

        // Rebuild tracks based on the preset definition
        pattern.tracks = preset.tracks.map((pTrack, index) => {
            const sample = getRandomSample(pTrack.category);
            const steps = createEmptySteps();
            for (let i = 0; i < 16; i++) {
                if (pTrack.pattern[i] === '1') {
                    steps[i].active = true;
                    steps[i].velocity = 3;
                }
            }
            return {
                id: `track-${Date.now()}-${index}`,
                name: sample.label,
                category: pTrack.category,
                sampleUrl: sample.url,
                gain: 0.8,
                pan: 0,
                steps
            };
        });

        patterns[state.activePatternId] = pattern;

        // Also update tempo
        engine.setTempo(preset.tempo);
        engine.updateTracks(pattern.tracks);

        return { patterns, tempo: preset.tempo };
    }),

    saveState: () => {
        const state = get();
        const exportData = {
            tempo: state.tempo,
            masterVolume: state.masterVolume,
            tapeDistortion: state.tapeDistortion,
            swing: state.swing,
            jank: state.jank,
            autoFill: state.autoFill,
            patterns: state.patterns
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "drummer-patch.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },

    loadState: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target?.result as string);
                    if (parsed.patterns) {
                        set({
                            tempo: parsed.tempo ?? 120,
                            masterVolume: parsed.masterVolume ?? 0.8,
                            tapeDistortion: parsed.tapeDistortion ?? 0,
                            swing: typeof parsed.swing === 'number' ? parsed.swing : 0,
                            jank: parsed.jank ?? 0,
                            autoFill: parsed.autoFill ?? 0,
                            patterns: parsed.patterns
                        });
                        engine.setTempo(parsed.tempo ?? 120);
                        engine.setMasterVolume(parsed.masterVolume ?? 0.8);
                        engine.setTapeDistortion(parsed.tapeDistortion ?? 0);
                        engine.setSwing(typeof parsed.swing === 'number' ? parsed.swing : 0);
                        engine.updateTracks(parsed.patterns[get().activePatternId].tracks);
                    }
                } catch (err) {
                    console.error("Failed to load state", err);
                    alert("Invalid patch file.");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    setSongMode: (active) => set({ songMode: active, currentChainIndex: 0 }),

    addToChain: (id) => set(state => ({ patternChain: [...state.patternChain, id] })),

    removeFromChain: (index) => set(state => {
        const chain = [...state.patternChain];
        chain.splice(index, 1);
        return { patternChain: chain };
    }),

    clearChain: () => set({ patternChain: [], currentChainIndex: 0 }),

    loadSongChain: (chain) => set({ patternChain: chain, currentChainIndex: 0 }),

    loadSongPreset: (preset) => set(state => {
        const patterns = { ...state.patterns };

        // For each pattern defined in the preset
        Object.keys(preset.patterns).forEach(patIdStr => {
            const patternId = Number(patIdStr) as PatternId;
            const presetTracks = preset.patterns[patternId];
            if (!presetTracks) return;

            // Rebuild tracks based on the preset definition
            const newTracks = presetTracks.map((pTrack, index) => {
                const sample = getRandomSample(pTrack.category);
                const steps = createEmptySteps();
                for (let i = 0; i < 16; i++) {
                    if (pTrack.pattern[i] === '1') {
                        steps[i].active = true;
                        steps[i].velocity = 3;
                    }
                }
                return {
                    id: `track-${Date.now()}-${patternId}-${index}`,
                    name: sample.label,
                    category: pTrack.category,
                    sampleUrl: sample.url,
                    gain: 0.8,
                    pan: 0,
                    steps
                };
            });

            patterns[patternId] = {
                ...patterns[patternId],
                tracks: newTracks
            };
        });

        // Set the active pattern to the first one in the chain, or Pattern 1
        const nextActiveId = preset.chain.length > 0 ? preset.chain[0] : 1;

        engine.setTempo(preset.tempo);
        engine.updateTracks(patterns[nextActiveId].tracks);

        return {
            patternChain: preset.chain,
            currentChainIndex: 0,
            patterns,
            tempo: preset.tempo,
            activePatternId: nextActiveId
        };
    }),

    prepareNextPatternInChain: () => set(state => {
        if (!state.songMode || state.patternChain.length === 0) return state;

        const nextIndex = (state.currentChainIndex + 1) % state.patternChain.length;
        const nextPatternId = state.patternChain[nextIndex];

        // Let the engine know about the track updates for the new pattern
        engine.updateTracks(state.patterns[nextPatternId].tracks);

        return {
            currentChainIndex: nextIndex,
            activePatternId: nextPatternId
        };
    })
}));
