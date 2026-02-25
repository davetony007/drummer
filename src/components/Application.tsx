import { useSequencerStore, PatternId } from '../store/useSequencerStore';
import clsx from 'clsx';
import { Play, Square, Circle, Plus } from 'lucide-react';
import { Knob } from './Knob';
import { TrackHeader } from './TrackHeader';
import { useEffect } from 'react';
import { PRESETS } from '../constants/presets';

export function Application() {
    const store = useSequencerStore();

    const handlePatternSelect = (id: PatternId) => {
        store.setActivePattern(id);
    };

    // Global Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input (we don't have any yet, but good practice)
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.key) {
                case ' ':
                    e.preventDefault(); // Prevents page scroll
                    store.togglePlay();
                    break;
                case 'Escape':
                    e.preventDefault();
                    if (store.isPlaying) store.togglePlay();
                    break;
                case 'p':
                case 'P':
                    if (e.ctrlKey || e.metaKey) return; // ignore ctrl+p print
                    e.preventDefault();
                    store.toggleRecording();
                    break;
                case 's':
                case 'S':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        store.saveState();
                    }
                    break;
                case 'o':
                case 'O':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        store.loadState();
                    }
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                    if (!e.ctrlKey && !e.metaKey) {
                        store.setActivePattern(parseInt(e.key, 10) as PatternId);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [store]);

    return (
        <div className="bg-studio-panel rounded-lg shadow-panel p-6 max-w-5xl w-full border border-studio-border relative flex flex-col gap-4 font-inter text-studio-text">

            {/* Top Header Section */}
            <div className="relative z-10 flex justify-between items-start">
                <div className="flex gap-8">
                    {/* Tempo Controls & Kit Randomizer */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1 items-center bg-[#181818] p-2 px-4 rounded border border-[#2a2a2a]">
                            <span className="text-[10px] text-studio-text-muted font-bold tracking-widest leading-none">TEMPO</span>
                            <div className="flex items-center gap-3 text-xl font-bold text-studio-accent font-mono leading-none pt-1">
                                <button className="text-studio-text-muted hover:text-studio-text" onClick={() => store.setTempo(Math.max(40, store.tempo - 1))}>-</button>
                                <span className="w-10 text-center">{store.tempo}</span>
                                <button className="text-studio-text-muted hover:text-studio-text" onClick={() => store.setTempo(Math.min(300, store.tempo + 1))}>+</button>
                            </div>
                        </div>
                        <button
                            className="studio-btn py-1.5 px-2 text-[10px] tracking-widest font-bold text-studio-text-muted hover:text-studio-text uppercase"
                            onClick={() => store.randomizeKit()}
                            title="Randomize Kit"
                        >
                            RND KIT
                        </button>
                    </div>

                    {/* Transport */}
                    <div className="flex gap-2">
                        <button
                            className={clsx(
                                "studio-btn px-4 py-2 flex items-center gap-2 text-sm uppercase tracking-wider font-bold",
                                store.isPlaying ? "active text-studio-active" : "text-studio-text"
                            )}
                            onClick={store.togglePlay}
                        >
                            <Play size={14} fill="currentColor" /> {store.isPlaying ? 'pause' : 'play'}
                        </button>
                        <button
                            className="studio-btn px-4 py-2 flex items-center gap-2 text-sm uppercase tracking-wider font-bold text-studio-text"
                        >
                            <Circle size={14} fill="currentColor" className="text-red-500" /> rec
                        </button>
                        <button
                            className="studio-btn px-4 py-2 flex items-center gap-2 text-sm uppercase tracking-wider font-bold text-studio-text"
                            onClick={() => store.isPlaying && store.togglePlay()}
                        >
                            <Square size={14} fill="currentColor" /> stop
                        </button>
                    </div>

                    {/* Patterns Selection */}
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 items-center bg-[#181818] p-2 rounded border border-[#2a2a2a]">
                            <span className="text-xs font-bold tracking-widest text-studio-text-muted uppercase mr-2">Pattern</span>
                            {[1, 2, 3, 4, 5, 6].map(id => (
                                <button
                                    key={`pat-${id}`}
                                    onClick={() => handlePatternSelect(id as PatternId)}
                                    className={clsx(
                                        "w-10 h-10 flex flex-col items-center pt-2 font-bold text-sm studio-btn relative rounded-[3px] transition-colors",
                                        store.activePatternId === id ? "active text-studio-active" : "text-studio-text"
                                    )}
                                >
                                    {id}
                                    <span className="text-[9px] text-studio-text-muted absolute bottom-0.5 right-1 leading-none">{store.patterns[id as PatternId].loopState}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Master Knobs & Export */}
                <div className="flex gap-6 items-center bg-[#181818] p-3 px-6 rounded border border-[#2a2a2a]">
                    <div className="flex flex-col items-center gap-3 border-r border-[#333] pr-6 mr-2">
                        <button
                            className={clsx(
                                "studio-btn w-10 h-10 rounded-full font-bold text-[10px] transition-colors",
                                store.isRecording ? "active text-[#121212] bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-500 bg-none" : "text-red-500"
                            )}
                            title="Print / Record Audio"
                            onClick={store.toggleRecording}
                            style={store.isRecording ? { background: '#ef4444' } : {}}
                        >
                            REC
                        </button>
                        <button
                            className={clsx(
                                "studio-btn px-2 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors",
                                store.isMetronomeEnabled ? "active text-studio-accent border-studio-accent" : "text-studio-text-muted"
                            )}
                            title="Toggle Metronome"
                            onClick={store.toggleMetronome}
                        >
                            MTR
                        </button>
                    </div>
                    <Knob value={store.masterVolume} onChange={store.setMasterVolume} label="MASTER" size={48} />
                    <Knob value={store.tapeDistortion} onChange={store.setTapeDistortion} label="TAPE" size={48} />
                </div>
            </div>

            {/* Sequencer Section */}
            <div className="relative z-10 flex flex-col gap-1.5 mt-2 bg-[#181818] p-3 rounded border border-[#2a2a2a] overflow-x-hidden overflow-y-auto custom-scrollbar" style={{ maxHeight: '400px' }}>
                {store.patterns[store.activePatternId].tracks.map((track) => {
                    return (
                        <div key={track.id} className="flex gap-4 items-center group bg-[#1e1e1e] p-1.5 rounded border border-[#2a2a2a]">
                            <TrackHeader trackId={track.id} name={track.name} category={track.category} />

                            <div className="flex gap-1 flex-1">
                                {track.steps.map((step, i) => (
                                    <button
                                        key={i}
                                        className={clsx(
                                            "step-btn flex flex-col justify-end items-center pb-0.5",
                                            step.active && "active",
                                            store.isPlaying && store.currentStep === i && "playing",
                                            i % 4 === 0 && !step.active && "bg-[#333]"
                                        )}
                                        onClick={(e) => {
                                            if (e.shiftKey) {
                                                // Cycle ratchets 1 -> 2 -> 3 -> 4
                                                store.toggleStep(store.activePatternId, track.id, i, step.velocity, (step.ratchet % 4) + 1, step.triplet);
                                            } else if (e.altKey) {
                                                // Toggle triplet
                                                store.toggleStep(store.activePatternId, track.id, i, step.velocity, step.ratchet, !step.triplet);
                                            } else {
                                                store.toggleStep(store.activePatternId, track.id, i);
                                            }
                                        }}
                                    >
                                        {/* Modifiers UI indicator */}
                                        {step.active && step.ratchet > 1 && (
                                            <div className="flex gap-[1px] mb-[2px]">
                                                {Array.from({ length: step.ratchet }).map((_, rIdx) => (
                                                    <div key={rIdx} className={clsx("w-1 h-1 rounded-full", step.triplet ? "bg-[#fff]" : "bg-[#111]")} />
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3 px-2">
                                <Knob value={track.pan === undefined ? 0.5 : (track.pan + 1) / 2} onChange={(val) => store.setTrackPan(track.id, (val * 2) - 1)} size={24} label="PAN" />
                                <Knob value={track.gain} onChange={(val) => store.setTrackVolume(track.id, val)} size={24} label="VOL" />
                            </div>
                        </div>
                    );
                })}

                <button
                    className="mt-2 studio-btn px-4 py-2 font-bold text-xs text-studio-text-muted hover:text-studio-text w-full max-w-[200px] mx-auto"
                    onClick={store.addTrack}
                >
                    <Plus size={14} className="mr-2 inline" /> ADD TRACK
                </button>
            </div>

            {/* Bottom Section */}
            <div className="relative z-10 flex justify-between items-center mt-2 bg-[#181818] p-4 rounded border border-[#2a2a2a]">
                <div className="flex gap-3">
                    <button
                        className="studio-btn px-6 py-2 text-xs font-bold text-studio-text uppercase tracking-widest"
                        onClick={store.generatePattern}
                    >GENERATE</button>
                    <div className="relative">
                        <select
                            className="studio-btn px-4 py-2 h-full text-xs font-bold text-studio-text uppercase tracking-widest outline-none cursor-pointer appearance-none text-center"
                            onChange={(e) => {
                                if (!e.target.value) return;
                                const preset = PRESETS.find(p => p.name === e.target.value);
                                if (preset) store.loadPreset(preset);
                                e.target.value = ""; // reset selection
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled className="bg-[#1e1e1e]">PRESETS ▾</option>
                            {Array.from(new Set(PRESETS.map(p => p.style))).map(style => (
                                <optgroup key={style} label={style} className="bg-[#1e1e1e] text-studio-accent font-bold">
                                    {PRESETS.filter(p => p.style === style).map(p => (
                                        <option key={p.name} value={p.name} className="text-studio-text font-normal">{p.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                    <button
                        className={clsx("studio-btn px-6 py-2 text-xs font-bold uppercase tracking-widest", store.jank > 0 ? "active text-studio-accent" : "text-studio-text")}
                        onClick={() => store.setJank((store.jank + 1) % 10)}
                    >
                        JANK {store.jank > 0 ? `[${store.jank}]` : ''}
                    </button>
                    <button
                        className="studio-btn px-6 py-2 text-xs font-bold text-studio-text uppercase tracking-widest"
                        onClick={store.duplicatePattern}
                    >DUPLICATE</button>
                </div>

                <div className="text-xl font-black text-[#333] tracking-[0.2em] select-none pointer-events-none">
                    DRUMMER<span className="text-studio-accent">.</span>PC
                </div>

                <div className="flex items-center gap-4">
                    <Knob value={store.swing} onChange={(val) => store.setSwing(val)} size={40} label="SWING" />
                </div>
            </div>

        </div >
    );
}
