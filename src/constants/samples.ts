export type SampleCategory = 'kick' | 'snare' | 'hihat' | 'perc' | 'clap' | 'cymbal' | 'tom';

export interface SampleDefinition {
    id: string; // The filename e.g. distkit-kick.wav
    label: string; // The display name e.g. "DistKit"
    category: SampleCategory;
    url: string; // The public path
}

export const DRUM_SAMPLES: Record<SampleCategory, SampleDefinition[]> = {
    kick: [
        { id: 'distkit-kick.wav', label: 'DistKit', category: 'kick', url: '/samples/distkit-kick.wav' },
        { id: 'sdbkit-kick.wav', label: 'SDBKit', category: 'kick', url: '/samples/sdbkit-kick.wav' },
        { id: 'sdbkit-sub-a.wav', label: 'SDBKit Sub', category: 'kick', url: '/samples/sdbkit-sub-a.wav' },
        { id: 'synthkit-kick.wav', label: 'SynthKit', category: 'kick', url: '/samples/synthkit-kick.wav' },
        { id: 'x0xproc1-kick.wav', label: 'X0x1', category: 'kick', url: '/samples/x0xproc1-kick.wav' },
        { id: 'x0xproc2-kick.wav', label: 'X0x2', category: 'kick', url: '/samples/x0xproc2-kick.wav' },
    ],
    snare: [
        { id: 'distkit-snare.wav', label: 'DistKit', category: 'snare', url: '/samples/distkit-snare.wav' },
        { id: 'sdbkit-snare.wav', label: 'SDBKit', category: 'snare', url: '/samples/sdbkit-snare.wav' },
        { id: 'synthkit-snare.wav', label: 'SynthKit', category: 'snare', url: '/samples/synthkit-snare.wav' },
        { id: 'x0xproc1-snare.wav', label: 'X0x1', category: 'snare', url: '/samples/x0xproc1-snare.wav' },
        { id: 'x0xproc2-snare.wav', label: 'X0x2', category: 'snare', url: '/samples/x0xproc2-snare.wav' },
    ],
    hihat: [
        { id: 'distkit-hatclsd.wav', label: 'DistKit Clsd', category: 'hihat', url: '/samples/distkit-hatclsd.wav' },
        { id: 'distkit-hatopen.wav', label: 'DistKit Open', category: 'hihat', url: '/samples/distkit-hatopen.wav' },
        { id: 'sdbkit-hatclsd.wav', label: 'SDBKit Clsd', category: 'hihat', url: '/samples/sdbkit-hatclsd.wav' },
        { id: 'sdbkit-hatopen.wav', label: 'SDBKit Open', category: 'hihat', url: '/samples/sdbkit-hatopen.wav' },
        { id: 'synthkit-hatclsd.wav', label: 'SynthKit Clsd', category: 'hihat', url: '/samples/synthkit-hatclsd.wav' },
        { id: 'synthkit-hatopen.wav', label: 'SynthKit Open', category: 'hihat', url: '/samples/synthkit-hatopen.wav' },
        { id: 'x0xproc1-hatclsd.wav', label: 'X0x1 Clsd', category: 'hihat', url: '/samples/x0xproc1-hatclsd.wav' },
        { id: 'x0xproc1-hatopen.wav', label: 'X0x1 Open', category: 'hihat', url: '/samples/x0xproc1-hatopen.wav' },
        { id: 'x0xproc2-hatclsd.wav', label: 'X0x2 Clsd', category: 'hihat', url: '/samples/x0xproc2-hatclsd.wav' },
        { id: 'x0xproc2-hatopen.wav', label: 'X0x2 Open', category: 'hihat', url: '/samples/x0xproc2-hatopen.wav' },
    ],
    perc: [
        { id: 'distkit-claves.wav', label: 'DistKit Claves', category: 'perc', url: '/samples/distkit-claves.wav' },
        { id: 'distkit-cowbell.wav', label: 'DistKit Cowbell', category: 'perc', url: '/samples/distkit-cowbell.wav' },
        { id: 'distkit-zap.wav', label: 'DistKit Zap', category: 'perc', url: '/samples/distkit-zap.wav' },
        { id: 'sdbkit-fmperc.wav', label: 'SDBKit FM', category: 'perc', url: '/samples/sdbkit-fmperc.wav' },
        { id: 'synthkit-8bit.wav', label: 'SynthKit 8-Bit', category: 'perc', url: '/samples/synthkit-8bit.wav' },
        { id: 'x0xproc1-rimshot.wav', label: 'X0x1 Rim', category: 'perc', url: '/samples/x0xproc1-rimshot.wav' },
        { id: 'x0xproc2-claves.wav', label: 'X0x2 Claves', category: 'perc', url: '/samples/x0xproc2-claves.wav' },
        { id: 'x0xproc2-cowbell.wav', label: 'X0x2 Cowbell', category: 'perc', url: '/samples/x0xproc2-cowbell.wav' },
        { id: 'x0xproc2-maracas.wav', label: 'X0x2 Maracas', category: 'perc', url: '/samples/x0xproc2-maracas.wav' },
        { id: 'x0xproc2-rimshot.wav', label: 'X0x2 Rim', category: 'perc', url: '/samples/x0xproc2-rimshot.wav' },
    ],
    clap: [
        { id: 'distkit-clap.wav', label: 'DistKit', category: 'clap', url: '/samples/distkit-clap.wav' },
        { id: 'sdbkit-clap.wav', label: 'SDBKit', category: 'clap', url: '/samples/sdbkit-clap.wav' },
        { id: 'synthkit-clap.wav', label: 'SynthKit', category: 'clap', url: '/samples/synthkit-clap.wav' },
        { id: 'x0xproc1-clap.wav', label: 'X0x1', category: 'clap', url: '/samples/x0xproc1-clap.wav' },
        { id: 'x0xproc2-clap.wav', label: 'X0x2', category: 'clap', url: '/samples/x0xproc2-clap.wav' },
    ],
    cymbal: [
        { id: 'distkit-crash.wav', label: 'DistKit Crash', category: 'cymbal', url: '/samples/distkit-crash.wav' },
        { id: 'distkit-ride.wav', label: 'DistKit Ride', category: 'cymbal', url: '/samples/distkit-ride.wav' },
        { id: 'synthkit-crash.wav', label: 'SynthKit Crash', category: 'cymbal', url: '/samples/synthkit-crash.wav' },
        { id: 'synthkit-ride.wav', label: 'SynthKit Ride', category: 'cymbal', url: '/samples/synthkit-ride.wav' },
        { id: 'x0xproc1-crash.wav', label: 'X0x1 Crash', category: 'cymbal', url: '/samples/x0xproc1-crash.wav' },
        { id: 'x0xproc1-ride.wav', label: 'X0x1 Ride', category: 'cymbal', url: '/samples/x0xproc1-ride.wav' },
        { id: 'x0xproc2-cymbal.wav', label: 'X0x2 Cymbal', category: 'cymbal', url: '/samples/x0xproc2-cymbal.wav' },
    ],
    tom: [
        { id: 'distkit-hitom.wav', label: 'DistKit High', category: 'tom', url: '/samples/distkit-hitom.wav' },
        { id: 'distkit-midtom.wav', label: 'DistKit Mid', category: 'tom', url: '/samples/distkit-midtom.wav' },
        { id: 'distkit-lotom.wav', label: 'DistKit Low', category: 'tom', url: '/samples/distkit-lotom.wav' },
        { id: 'sdbkit-hitom.wav', label: 'SDBKit High', category: 'tom', url: '/samples/sdbkit-hitom.wav' },
        { id: 'sdbkit-midtom.wav', label: 'SDBKit Mid', category: 'tom', url: '/samples/sdbkit-midtom.wav' },
        { id: 'sdbkit-lotom.wav', label: 'SDBKit Low', category: 'tom', url: '/samples/sdbkit-lotom.wav' },
        { id: 'synthkit-hitom.wav', label: 'SynthKit High', category: 'tom', url: '/samples/synthkit-hitom.wav' },
        { id: 'synthkit-midtom.wav', label: 'SynthKit Mid', category: 'tom', url: '/samples/synthkit-midtom.wav' },
        { id: 'synthkit-lotom.wav', label: 'SynthKit Low', category: 'tom', url: '/samples/synthkit-lotom.wav' },
        { id: 'x0xproc1-hitom.wav', label: 'X0x1 High', category: 'tom', url: '/samples/x0xproc1-hitom.wav' },
        { id: 'x0xproc1-midtom.wav', label: 'X0x1 Mid', category: 'tom', url: '/samples/x0xproc1-midtom.wav' },
        { id: 'x0xproc1-lotom.wav', label: 'X0x1 Low', category: 'tom', url: '/samples/x0xproc1-lotom.wav' },
        { id: 'x0xproc2-hitom.wav', label: 'X0x2 High', category: 'tom', url: '/samples/x0xproc2-hitom.wav' },
        { id: 'x0xproc2-midtom.wav', label: 'X0x2 Mid', category: 'tom', url: '/samples/x0xproc2-midtom.wav' },
        { id: 'x0xproc2-lotom.wav', label: 'X0x2 Low', category: 'tom', url: '/samples/x0xproc2-lotom.wav' },
    ]
};

// Helper to get a flat list of all samples
export const ALL_SAMPLES = Object.values(DRUM_SAMPLES).flat();
