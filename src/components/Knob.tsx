import { useCallback } from 'react';

interface KnobProps {
    value: number; // 0 to 1
    onChange: (val: number) => void;
    size?: number;
    label?: string;
}

export function Knob({ value, onChange, size = 48, label }: KnobProps) {
    // Angle mapped from value 0-1 to -135deg to +135deg
    const angle = (value * 270) - 135;

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        const target = e.target as HTMLElement;
        target.setPointerCapture(e.pointerId);

        const startY = e.clientY;
        const startVal = value;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const deltaY = startY - moveEvent.clientY;
            const sensitivity = moveEvent.shiftKey ? 0.001 : 0.005; // Shift to fine-tune
            const newVal = Math.max(0, Math.min(1, startVal + deltaY * sensitivity));
            onChange(newVal);
        };

        const handlePointerUp = (upEvent: PointerEvent) => {
            const upTarget = upEvent.target as HTMLElement;
            if (upTarget.releasePointerCapture) {
                upTarget.releasePointerCapture(upEvent.pointerId);
            }
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    }, [value, onChange]);

    return (
        <div className="flex flex-col items-center justify-center gap-1.5 select-none">
            <div
                className="relative rounded-full cursor-pointer flex items-center justify-center box-border"
                style={{
                    width: size,
                    height: size,
                    transform: `rotate(${angle}deg)`,
                    background: 'linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.1)',
                    border: '1px solid #111'
                }}
                onPointerDown={handlePointerDown}
            >
                {/* Pointer indicator line */}
                <div className="absolute top-[2px] w-1 h-[35%] bg-studio-accent shadow-[0_0_5px_rgba(255,107,0,0.8)] rounded-full" />

                {/* Inner center dot for detail */}
                <div className="absolute w-[30%] h-[30%] bg-[#111] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
            </div>
            {label && <span className="text-[9px] text-studio-text-muted font-bold uppercase tracking-widest">{label}</span>}
        </div>
    );
}
