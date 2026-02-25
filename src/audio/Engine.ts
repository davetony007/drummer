import * as Tone from 'tone';
import { useSequencerStore, TrackData } from '../store/useSequencerStore';

class AudioEngine {
    private masterVolume: Tone.Volume;
    private tapePlugin: Tone.Distortion; // simple distortion for now
    private recorder: Tone.Recorder;
    private trackPlayers: Record<string, { player: Tone.Player, channel: Tone.Channel }> = {};
    private metronomeSynth: Tone.MembraneSynth;
    private isInitialized = false;
    private scheduleId: number | null = null;
    public isRecording: boolean = false;
    private currentUrls: Record<string, string> = {};
    private barCount: number = 1;
    private wasFillBar: boolean = false;

    constructor() {
        this.masterVolume = new Tone.Volume(0).toDestination();
        this.tapePlugin = new Tone.Distortion(0).connect(this.masterVolume);

        // Metronome synth bypassing tape distortion, straight to master
        this.metronomeSynth = new Tone.MembraneSynth({
            pitchDecay: 0.008,
            octaves: 2,
            oscillator: { type: "square4" },
            envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.01 }
        }).connect(this.masterVolume);
        this.metronomeSynth.volume.value = -12; // Lower volume for click

        this.recorder = new Tone.Recorder();
        this.masterVolume.connect(this.recorder);
    }

    async initialize() {
        if (this.isInitialized) return;
        await Tone.start();

        // Load initial tracks from the active pattern
        const state = useSequencerStore.getState();
        await this.updateTracks(state.patterns[state.activePatternId].tracks);

        Tone.Transport.bpm.value = state.tempo;
        this.isInitialized = true;
    }

    async updateTracks(tracks: TrackData[]) {
        const currentIds = new Set(Object.keys(this.trackPlayers));

        for (const track of tracks) {
            const id = track.id;
            const url = track.sampleUrl;
            currentIds.delete(id);

            if (!this.trackPlayers[id]) {
                const channel = new Tone.Channel({
                    pan: track.pan || 0,
                    volume: track.gain === 0 ? -Infinity : 20 * Math.log10(track.gain)
                }).connect(this.tapePlugin);
                const player = new Tone.Player().connect(channel);
                await player.load(url);
                this.trackPlayers[id] = { player, channel };
                this.currentUrls[id] = url;
            } else {
                const tp = this.trackPlayers[id];
                tp.channel.pan.value = track.pan || 0;
                if (track.gain === 0) tp.channel.mute = true;
                else {
                    tp.channel.mute = false;
                    tp.channel.volume.value = 20 * Math.log10(track.gain);
                }

                if (this.currentUrls[id] !== url) {
                    await tp.player.load(url);
                    this.currentUrls[id] = url;
                }
            }
        }

        // Clean up removed tracks
        for (const id of currentIds) {
            this.trackPlayers[id].player.dispose();
            this.trackPlayers[id].channel.dispose();
            delete this.trackPlayers[id];
            delete this.currentUrls[id];
        }
    }

    startTransport() {
        if (!this.isInitialized) return;
        if (Tone.Transport.state !== 'started') {
            this.barCount = 1;
            this.wasFillBar = false;
            Tone.Transport.start();
            this.scheduleSequence();
        }
    }

    stopTransport() {
        Tone.Transport.stop();
        if (this.scheduleId !== null) {
            Tone.Transport.clear(this.scheduleId);
            this.scheduleId = null;
        }
    }

    private scheduleSequence() {
        if (this.scheduleId !== null) Tone.Transport.clear(this.scheduleId);

        let step = 0;

        this.scheduleId = Tone.Transport.scheduleRepeat((time) => {
            const state = useSequencerStore.getState();
            const pattern = state.patterns[state.activePatternId];

            // Update UI
            Tone.Draw.schedule(() => {
                state.setCurrentStep(step);
            }, time);

            // Metronome Click
            if (state.isMetronomeEnabled && step % 4 === 0) {
                // High click on the 1, low click on 2, 3, 4
                const note = step === 0 ? "C5" : "C4";
                this.metronomeSynth.triggerAttackRelease(note, "32n", time, step === 0 ? 1 : 0.5);
            }

            const isFillBar = state.autoFill > 0 && this.barCount % state.autoFill === 0;
            const isFillStep = isFillBar && step >= 8; // Fill occupies last 2 beats

            // Crash on the 1 after a fill
            if (step === 0 && this.wasFillBar) {
                const cymbalTrack = pattern.tracks.find(t => t.category === 'cymbal' || t.name.toLowerCase().includes('crash'));
                if (cymbalTrack) {
                    this.playNote(cymbalTrack.id, 1, time);
                }
            }

            if (step === 0) {
                this.wasFillBar = false;
            }

            if (isFillStep) {
                // Procedural Fill Generation
                // Find snare and tom tracks
                const snares = pattern.tracks.filter(t => t.category === 'snare');
                const toms = pattern.tracks.filter(t => t.category === 'tom');
                const kicks = pattern.tracks.filter(t => t.category === 'kick');

                const snareId = snares.length > 0 ? snares[0].id : null;
                const tomId = toms.length > 0 ? toms[0].id : (snares.length > 1 ? snares[1].id : null);
                const kickId = kicks.length > 0 ? kicks[0].id : null;

                const stepTime = Tone.Time("16n").toSeconds();

                if (step >= 8 && step < 12) {
                    // Beat 3: Snare/Tom roll
                    if (snareId) {
                        this.playNote(snareId, 0.6, time);
                        if (step % 2 !== 0) {
                            this.playNote(snareId, 0.4, time + stepTime / 2); // 32nd note ghost
                        }
                    }
                } else if (step >= 12 && step < 16) {
                    // Beat 4: Tom roll or build up
                    const targetId = tomId || snareId;
                    if (targetId) {
                        this.playNote(targetId, 0.8 + ((step - 12) * 0.05), time); // Crescendo
                        if (step === 14 || step === 15) {
                            this.playNote(targetId, 0.6, time + stepTime / 2);
                        }
                    }
                    if (kickId && step % 2 === 0) {
                        this.playNote(kickId, 0.8, time); // Four on the floor build
                    }
                }

                if (step === 15) {
                    this.wasFillBar = true;
                }
            } else {
                // Standard playback
                pattern.tracks.forEach(track => {
                    const stepData = track.steps[step];
                    if (stepData.active) {
                        const r = stepData.ratchet || 1;

                        if (r === 1) {
                            this.playNote(track.id, stepData.velocity / 4, time);
                        } else {
                            const stepTime = Tone.Time("16n").toSeconds();
                            let subStepTime = stepTime / r;

                            if (stepData.triplet) {
                                subStepTime = stepTime / r;
                            }

                            for (let i = 0; i < r; i++) {
                                const noteTime = time + (i * subStepTime);
                                this.playNote(track.id, stepData.velocity / 4, noteTime);
                            }
                        }
                    }
                });
            }

            // Advance Pattern if we are at the end of the bar in Song Mode
            if (step === 15) {
                if (state.songMode) {
                    // Schedule the state update slightly in the future to ensure all notes for step 15 finish triggering
                    // before React re-renders, but before step 0 has to be evaluated.
                    Tone.Draw.schedule(() => {
                        useSequencerStore.getState().advanceSongBar();
                    }, time + 0.01);
                }

                // Advance bar count for auto-fills
                Tone.Draw.schedule(() => {
                    this.barCount++;
                }, time + 0.01);
            }

            step = (step + 1) % 16;
        }, "16n");
    }

    playNote(trackId: string, velocity: number = 1, time?: Tone.Unit.Time) {
        if (!this.isInitialized || !this.trackPlayers[trackId]) return;

        const { player } = this.trackPlayers[trackId];
        const triggerTime = time ?? Tone.now();

        // Apply Jank (humanize timing/velocity slightly based on store state)
        const jankAmt = useSequencerStore.getState().jank;
        let timingOffset = 0;
        let velMod = velocity;

        if (jankAmt > 0) {
            // Jank 1-9: add up to 50ms offset, scale velocity by +/- 50%
            const swingMax = 0.05 * (jankAmt / 9);
            timingOffset = (Math.random() * swingMax * 2) - swingMax;

            const velVariance = 0.5 * (jankAmt / 9);
            velMod = velocity * (1 + (Math.random() * velVariance * 2 - velVariance));
            velMod = Math.min(Math.max(velMod, 0.01), 1.0);
        }

        const t = (typeof triggerTime === 'number' ? triggerTime : Tone.Time(triggerTime).toSeconds()) + timingOffset;

        player.volume.setValueAtTime(20 * Math.log10(velMod), t);
        player.start(t);
    }

    setMasterVolume(level: number) { this.masterVolume.volume.value = level === 0 ? -Infinity : 20 * Math.log10(level); }
    setTapeDistortion(amount: number) { this.tapePlugin.distortion = amount * 0.8; }
    setTempo(bpm: number) { Tone.Transport.bpm.value = bpm; }
    setSwing(val: number) {
        Tone.Transport.swing = val;
        Tone.Transport.swingSubdivision = "16n";
    }

    async toggleRecording() {
        if (!this.isInitialized) return false;
        if (this.isRecording) {
            const recording = await this.recorder.stop();
            this.isRecording = false;
            const url = URL.createObjectURL(recording);
            const anchor = document.createElement("a");
            anchor.download = "drummer-beat.webm";
            anchor.href = url;
            anchor.click();
            return false;
        } else {
            this.recorder.start();
            this.isRecording = true;
            return true;
        }
    }
}

export const engine = new AudioEngine();
