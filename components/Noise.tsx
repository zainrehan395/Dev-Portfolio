const Noise = () => {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-50 opacity-[0.04]"
            style={{
                // A tiny 50x50 noise tile base64 that repeats infinitely
                backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAAMAAAAe3DNGAAAANElEQVRYR2P4z8AARjIsm7QEw0gMBoNGA6HRIHw0EBqNBoNGA6HRIHw0EBqNBoNGA6GxDAwAn7X8EbWe0bIAAAAASUVORK5CYII=")`,
                backgroundRepeat: 'repeat',
            }}
        />
    );
};

export default Noise;