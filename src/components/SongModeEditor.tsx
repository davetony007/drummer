import { useSequencerStore } from '../store/useSequencerStore';
import clsx from 'clsx';
import { X, ListMusic } from 'lucide-react';
import React from 'react';
import { PATTERN_LABELS, SONG_STRUCTURES } from '../constants/songStructures';

export function SongModeEditor() {
    const store = useSequencerStore();

    if (!store.songMode) return null;

    return (
        <div className="flex flex-col gap-2 bg-[#181818] p-3 rounded border border-[#2a2a2a] mb-2">
            <div className="flex items-center gap-2 mb-1">
                <ListMusic size={14} className="text-studio-accent" />
                <span className="text-xs font-bold tracking-widest text-studio-accent uppercase">Song Mode Chain</span>
                <span className="text-[10px] text-studio-text-muted ml-auto">
                    {store.patternChain.length} {store.patternChain.length === 1 ? 'Pattern' : 'Patterns'}
                </span>
                {store.patternChain.length > 0 && (
                    <button
                        className="ml-2 px-2 py-0.5 text-[9px] font-bold text-red-400 hover:text-red-300 border border-red-900/50 hover:border-red-400/50 rounded transition-colors"
                        onClick={store.clearChain}
                    >
                        CLEAR
                    </button>
                )}
                <div className="ml-2 relative">
                    <select
                        className="bg-[#222] border border-[#333] text-studio-text-muted text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded outline-none cursor-pointer appearance-none hover:border-[#555] transition-colors"
                        onChange={(e) => {
                            if (!e.target.value) return;
                            const preset = SONG_STRUCTURES.find(p => p.name === e.target.value);
                            if (preset) {
                                if (store.patternChain.length > 0) {
                                    if (confirm("This will overwrite your current chain. Continue?")) {
                                        store.loadSongPreset(preset);
                                    }
                                } else {
                                    store.loadSongPreset(preset);
                                }
                            }
                            e.target.value = ""; // reset selection
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>STRUCTURE PRESETS ▾</option>
                        {SONG_STRUCTURES.map(preset => (
                            <option key={preset.name} value={preset.name} title={preset.description}>
                                {preset.name} ({preset.style})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-start gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {store.patternChain.map((chainItem, index) => (
                    <React.Fragment key={`${index}-${chainItem.patternId}`}>
                        <div className="flex flex-col items-center gap-1 w-16">
                            <div
                                className={clsx(
                                    "flex items-center justify-center relative w-full h-8 rounded-[3px] border transition-colors group",
                                    store.isPlaying && store.currentChainIndex === index
                                        ? "bg-studio-accent/20 border-studio-accent text-studio-accent pb-0" // The current playing item
                                        : "bg-[#222] border-[#333] text-studio-text hover:border-[#555]"
                                )}
                            >
                                <span className="font-bold text-[10px] tracking-widest px-2">{PATTERN_LABELS[chainItem.patternId]}</span>

                                {/* Remove button (appears on hover) */}
                                <button
                                    className="absolute -top-1.5 -right-1.5 bg-[#444] text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all z-10"
                                    onClick={() => store.removeFromChain(index)}
                                    title="Remove from chain"
                                >
                                    <X size={10} strokeWidth={3} />
                                </button>
                            </div>

                            {/* Bar selection & Progress */}
                            <div className="w-full flex flex-col items-center">
                                <select
                                    className="bg-transparent text-[9px] text-studio-text-muted outline-none cursor-pointer hover:text-studio-text text-center text-center-last"
                                    value={chainItem.bars}
                                    onChange={(e) => store.updateChainItemBars(index, parseInt(e.target.value))}
                                >
                                    {[1, 2, 4, 8, 16, 32].map(b => (
                                        <option key={b} value={b} className="bg-[#222] text-left">
                                            {b} BAR{b > 1 ? 'S' : ''}
                                        </option>
                                    ))}
                                </select>

                                {store.isPlaying && store.currentChainIndex === index && (
                                    <div className="w-full h-1 bg-[#111] rounded-full overflow-hidden mt-0.5 border border-[#333]">
                                        <div
                                            className="h-full bg-studio-accent transition-all duration-300"
                                            style={{ width: `${Math.max(5, ((store.currentChainBar) / chainItem.bars) * 100)}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Arrow separator, except after the last item */}
                        {index < store.patternChain.length - 1 && (
                            <div className="text-[#444] font-bold mt-1.5">→</div>
                        )}
                    </React.Fragment>
                ))}

                {store.patternChain.length === 0 && (
                    <span className="text-xs text-studio-text-muted italic">Click the + buttons below to start building a song chain.</span>
                )}
            </div>
        </div>
    );
}
