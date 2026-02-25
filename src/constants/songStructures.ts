import { PatternId } from '../store/useSequencerStore';
import { PresetTrackData } from './presets';

export const PATTERN_LABELS: Record<PatternId, string> = {
    1: 'INTRO',
    2: 'VERSE',
    3: 'PRE',    // Pre-Chorus
    4: 'CHORUS',
    5: 'BRIDGE', // or Solo
    6: 'OUTRO'
};

export interface SongStructure {
    name: string;
    style: string;
    tempo: number;
    chain: PatternId[];
    description: string;
    patterns: Partial<Record<PatternId, PresetTrackData[]>>;
}

export const SONG_STRUCTURES: SongStructure[] = [
    {
        name: "The Early Fab Four",
        style: "60s Pop",
        tempo: 130,
        chain: [1, 2, 2, 4, 2, 5, 2, 4, 6], // Intro, V, V, C, V, Bridge, V, C, Outro
        description: "A classic bouncy pop structure with a distinct middle 8.",
        patterns: {
            1: [ // INTRO (Ringo style tom build)
                { category: "kick", pattern: "1.......1......." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "tom", pattern: "1.1.1.1.1.1.1.1." }
            ],
            2: [ // VERSE (Bouncy beat)
                { category: "kick", pattern: "1.......1..1...." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "hihat", pattern: "1.1..1.11.1..1.1" }
            ],
            4: [ // CHORUS (Straighter with crash/ride)
                { category: "kick", pattern: "1..1....1..1...." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "cymbal", pattern: "1.1.1.1.1.1.1.1." },
                { category: "cymbal", pattern: "1..............." }
            ],
            5: [ // BRIDGE
                { category: "kick", pattern: "1...1...1...1..." },
                { category: "snare", pattern: "....1.......1..1" },
                { category: "cymbal", pattern: "1.1.1.1.1.1.1.1." }
            ],
            6: [ // OUTRO
                { category: "kick", pattern: "1.......1......." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "tom", pattern: "1...........1..." },
                { category: "cymbal", pattern: "1..............." }
            ]
        }
    },
    {
        name: "The Stadium Anthem",
        style: "Arena Rock",
        tempo: 85,
        chain: [1, 2, 3, 4, 2, 3, 4, 5, 4, 4, 6],
        description: "Big buildup with a pre-chorus leading into massive choruses (Queen style).",
        patterns: {
            1: [ // INTRO (Boom boom clap!)
                { category: "kick", pattern: "1.1.....1.1....." },
                { category: "snare", pattern: "....1.......1..." }
            ],
            2: [ // VERSE (Boom boom clap!)
                { category: "kick", pattern: "1.1.....1.1....." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "hihat", pattern: "....1.......1..." }
            ],
            3: [ // PRE-CHORUS (Building tension)
                { category: "kick", pattern: "1...1...1...1..." },
                { category: "snare", pattern: "1...1...1...1..." },
                { category: "tom", pattern: "..11..11..11..11" }
            ],
            4: [ // CHORUS (Full blast)
                { category: "kick", pattern: "1..1....1..1...." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "cymbal", pattern: "1...1...1...1..." }
            ],
            5: [ // SOLO (Driving)
                { category: "kick", pattern: "1.......1......." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "cymbal", pattern: "1.1.1.1.1.1.1.1." }
            ],
            6: [ // OUTRO (Big finish)
                { category: "kick", pattern: "1.1.....1.1....." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "cymbal", pattern: "1...1...1...1..." }
            ]
        }
    },
    {
        name: "The Heavy Groove",
        style: "70s Hard Rock",
        tempo: 95,
        chain: [1, 2, 2, 4, 5, 2, 4, 6], // Intro, V, V, C, Solo, V, C, Outro
        description: "A heavy, swinging groove (Led Zep style).",
        patterns: {
            1: [ // INTRO
                { category: "kick", pattern: "1.1...1.....1..." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "hihat", pattern: "1...1...1...1..." }
            ],
            2: [ // VERSE (Syncopated kick)
                { category: "kick", pattern: "1.1...1...1.1..." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "hihat", pattern: "1.1.1.1.1.1.1.1." },
                { category: "kick", pattern: "........1......." }
            ],
            4: [ // CHORUS (Ride and loud)
                { category: "kick", pattern: "1.......1......." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "cymbal", pattern: "1.1.1.1.1.1.1.1." },
                { category: "cymbal", pattern: "1..............." }
            ],
            5: [ // SOLO (Riding the bell)
                { category: "kick", pattern: "1.....1...1....." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "cymbal", pattern: "1.1.1.1.1.1.1.1." }
            ],
            6: [ // OUTRO
                { category: "kick", pattern: "1.1...1.1.1...1." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "cymbal", pattern: "1...1...1...1..." }
            ]
        }
    },
    {
        name: "The Britpop Banger",
        style: "90s Indie",
        tempo: 115,
        chain: [1, 2, 3, 4, 2, 3, 4, 5, 3, 4, 4, 6], // Oasis style extended outro
        description: "Standard mid-tempo late 90s structure, ending on a massive double chorus.",
        patterns: {
            1: [ // INTRO (Tambourine heavy)
                { category: "kick", pattern: "1.......1......." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "perc", pattern: "1.1.1.1.1.1.1.1." } // Tambourine
            ],
            2: [ // VERSE
                { category: "kick", pattern: "1...1...1...1..." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "hihat", pattern: "1.1.1.1.1.1.1.1." },
                { category: "perc", pattern: "1...1...1...1..." }
            ],
            3: [ // PRE-CHORUS (Slight build)
                { category: "kick", pattern: "1.......1......." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "hihat", pattern: "1.1.1.1.1.1.1.1." },
                { category: "tom", pattern: "............1111" }
            ],
            4: [ // CHORUS (Washy crash)
                { category: "kick", pattern: "1...1...1...1..." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "cymbal", pattern: "1...1...1...1..." }
            ],
            5: [ // SOLO
                { category: "kick", pattern: "1..1....1..1...." },
                { category: "snare", pattern: "....1.......1..." },
                { category: "cymbal", pattern: "1.1.1.1.1.1.1.1." }
            ],
            6: [ // OUTRO (Big finish, similar to chorus)
                { category: "kick", pattern: "1.1.1.1.1.1.1.1." },
                { category: "snare", pattern: "........1...1..." },
                { category: "cymbal", pattern: "1.1.1.1.1.1.1.1." }
            ]
        }
    }
];
