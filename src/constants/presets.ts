import { SampleCategory } from './samples';

export interface PresetTrackData {
    category: SampleCategory;
    pattern: string; // 16-character string, '1' for hit, '.' for rest
}

export interface PresetData {
    name: string;
    style: string;
    tempo: number;
    tracks: PresetTrackData[];
}

export const PRESETS: PresetData[] = [
    // --- ROCK ---
    {
        name: "Basic Rock",
        style: "Rock",
        tempo: 120,
        tracks: [
            { category: "kick", pattern: "1.......1......." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1.1.1.1.1.1.1." }
        ]
    },
    {
        name: "Rock Four-on-Floor",
        style: "Rock",
        tempo: 125,
        tracks: [
            { category: "kick", pattern: "1...1...1...1..." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1.1.1.1.1.1.1." }
        ]
    },
    {
        name: "Upbeat Rock",
        style: "Rock",
        tempo: 135,
        tracks: [
            { category: "kick", pattern: "1.......1..1...." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1.1.1.1.1.1.1." },
            { category: "perc", pattern: "..............1." }
        ]
    },
    {
        name: "Heavy Rock",
        style: "Rock",
        tempo: 110,
        tracks: [
            { category: "kick", pattern: "1..1....1..1...." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1.1.1.1.1.1.1." },
            { category: "clap", pattern: "...........1...." }
        ]
    },
    {
        name: "Syncopated Rock",
        style: "Rock",
        tempo: 115,
        tracks: [
            { category: "kick", pattern: "1.....1...1....." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1.1.1.1.1.1.1." }
        ]
    },

    // --- POP ---
    {
        name: "Standard Pop",
        style: "Pop",
        tempo: 115,
        tracks: [
            { category: "kick", pattern: "1...1...1...1..." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1.1.1.1.1.1.1." },
            { category: "perc", pattern: "..1...1...1...1." }
        ]
    },
    {
        name: "Pop Reggaeton",
        style: "Pop",
        tempo: 95,
        tracks: [
            { category: "kick", pattern: "1...1...1...1..." },
            { category: "snare", pattern: "...1..1....1..1." },
            { category: "hihat", pattern: "1...1...1...1..." }
        ]
    },
    {
        name: "Pop Shuffle",
        style: "Pop",
        tempo: 110, // Best with some swing
        tracks: [
            { category: "kick", pattern: "1.......1......." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1.1..11.1.1..1" },
            { category: "perc", pattern: ".......1.......1" }
        ]
    },
    {
        name: "Synth Pop",
        style: "Pop",
        tempo: 120,
        tracks: [
            { category: "kick", pattern: "1...1...1...1..." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "..1...1...1...1." },
            { category: "clap", pattern: ".1.1.1.1.1.1.1.1" }
        ]
    },
    {
        name: "Groovy Pop",
        style: "Pop",
        tempo: 105,
        tracks: [
            { category: "kick", pattern: "1..1....1......." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1.1.1.1.1.1.1." },
            { category: "perc", pattern: "......1...1...1." }
        ]
    },

    // --- DISCO ---
    {
        name: "Classic Disco",
        style: "Disco",
        tempo: 120,
        tracks: [
            { category: "kick", pattern: "1...1...1...1..." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "..1...1...1...1." }
        ]
    },
    {
        name: "Driving Disco",
        style: "Disco",
        tempo: 126,
        tracks: [
            { category: "kick", pattern: "1...1...1...1..." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1.1.1.1.1.1.1." },
            { category: "perc", pattern: "..11..11..11..11" }
        ]
    },
    {
        name: "Funky Disco",
        style: "Disco",
        tempo: 115,
        tracks: [
            { category: "kick", pattern: "1.......1.1....." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1.1.1.1.1.1.1." },
            { category: "clap", pattern: "..1...1...1...1." }
        ]
    },
    {
        name: "Euro Disco",
        style: "Disco",
        tempo: 130,
        tracks: [
            { category: "kick", pattern: "1...1...1...1..." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "111.111.111.111." }
        ]
    },
    {
        name: "Space Disco",
        style: "Disco",
        tempo: 124,
        tracks: [
            { category: "kick", pattern: "1...1...1...1..." },
            { category: "snare", pattern: "....1..1....1..1" },
            { category: "hihat", pattern: "..1...1...1...1." },
            { category: "perc", pattern: ".1.1.1.1.1.1.1.1" }
        ]
    },

    // --- RAP / HIP-HOP ---
    {
        name: "Classic Boom Bap",
        style: "Rap",
        tempo: 90,
        tracks: [
            { category: "kick", pattern: "1.......1..1...." },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1.1.1.1.1.1.1." }
        ]
    },
    {
        name: "Trap Basic",
        style: "Rap",
        tempo: 140, // Half-time feel
        tracks: [
            { category: "kick", pattern: "1.....1.....1..." },
            { category: "snare", pattern: "........1......." },
            { category: "hihat", pattern: "1111111111111111" }
        ]
    },
    {
        name: "Lo-Fi Hip Hop",
        style: "Rap",
        tempo: 80,
        tracks: [
            { category: "kick", pattern: "1......1..1....." },
            { category: "clap", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1..1.1.1..1.1." },
            { category: "perc", pattern: ".......1........" }
        ]
    },
    {
        name: "East Coast",
        style: "Rap",
        tempo: 93,
        tracks: [
            { category: "kick", pattern: "1..1....1......1" },
            { category: "snare", pattern: "....1.......1..." },
            { category: "hihat", pattern: "1.1.1.1.1.1.1.1." },
            { category: "perc", pattern: "...........1...." }
        ]
    },
    {
        name: "Modern Trap",
        style: "Rap",
        tempo: 150,
        tracks: [
            { category: "kick", pattern: "1.......1..1...." },
            { category: "snare", pattern: "........1......." },
            { category: "hihat", pattern: "1111111111111111" },
            { category: "perc", pattern: "......1.......1." }
        ]
    }
];
