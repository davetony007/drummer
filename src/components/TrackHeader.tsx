import { useState, useRef, useEffect } from 'react';
import { useSequencerStore } from '../store/useSequencerStore';
import { DRUM_SAMPLES, SampleCategory } from '../constants/samples';
import clsx from 'clsx';
import { ChevronDown, Trash2 } from 'lucide-react';
import * as Tone from 'tone';

interface TrackHeaderProps {
    trackId: string;
    name: string;
    category: SampleCategory;
}

export function TrackHeader({ trackId, name, category }: TrackHeaderProps) {
    const store = useSequencerStore();
    const [isOpen, setIsOpen] = useState(false);
    const [previewPlayer, setPreviewPlayer] = useState<Tone.Player | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelect = (url: string, label: string, cat: SampleCategory) => {
        store.changeTrackSample(trackId, url, label, cat);
        setIsOpen(false);
    };

    const handlePreview = async (url: string, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent selecting
        if (!previewPlayer) {
            const player = new Tone.Player(url).toDestination();
            player.autostart = true;
            setPreviewPlayer(player);
        } else {
            await previewPlayer.load(url);
            previewPlayer.start();
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                className="studio-btn w-24 h-8 px-2 flex items-center justify-between group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-col items-start truncate overflow-hidden leading-tight">
                    <span className="text-[9px] font-bold text-studio-text-muted uppercase tracking-wider">{category}</span>
                    <span className="text-xs font-bold text-studio-text truncate max-w-[60px]">{name}</span>
                </div>
                <ChevronDown size={14} className="text-studio-text-muted group-hover:text-studio-text transition-colors" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 max-h-[400px] overflow-y-auto bg-studio-panel border border-studio-border rounded shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 p-2 flex flex-col gap-4 custom-scrollbar">
                    <div className="flex justify-between items-center border-b border-[#333] pb-2">
                        <span className="font-bold text-sm text-studio-text tracking-wider uppercase">Select Sample</span>
                        {(store.patterns[store.activePatternId].tracks.length > 1) && (
                            <button
                                className="text-studio-text-muted hover:text-red-500 transition-colors p-1"
                                onClick={() => store.removeTrack(trackId)}
                                title="Remove Track"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>

                    {(Object.keys(DRUM_SAMPLES) as SampleCategory[]).map(cat => (
                        <div key={cat} className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase text-studio-text-muted pl-1 tracking-widest">{cat}</span>
                            {DRUM_SAMPLES[cat].map(sample => (
                                <div
                                    key={sample.id}
                                    className={clsx(
                                        "flex justify-between items-center px-2 py-1.5 rounded cursor-pointer transition-colors text-sm",
                                        name === sample.label && category === cat ? "bg-studio-accent/20 text-studio-accent font-bold" : "text-studio-text hover:bg-[#2a2a2a]"
                                    )}
                                    onClick={() => handleSelect(sample.url, sample.label, cat)}
                                >
                                    <span className="truncate">{sample.label}</span>
                                    <button
                                        onClick={(e) => handlePreview(sample.url, e)}
                                        className="text-[9px] uppercase tracking-wider px-2 py-1 bg-[#1a1a1a] border border-[#333] hover:border-studio-accent hover:text-studio-accent rounded transition-colors"
                                    >
                                        play
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
