import { GraduationCap } from "lucide-react";

interface LoaderProps {
    text?: string;
    variant?: 'default' | 'inverse';
    direction?: 'col' | 'row';
}

export function Loader({ 
    text = "Verificando sesión...", 
    variant = "default",
    direction = "col" 
}: LoaderProps) {
    if (variant === "inverse") {
        return (
            <div className={`flex items-center justify-center gap-2 ${direction === 'col' ? 'flex-col' : 'flex-row'}`}>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-loader-spin-slow" />
                <span className="text-white text-sm font-medium animate-pulse">{text}</span>
            </div>
        );
    }

    return (
        <section className="flex items-center justify-center">
            <div className={`flex ${direction === "col" ? "flex-col" : "flex-row"} items-center gap-6`}>
                <div className="relative flex items-center justify-center w-24 h-24">
                    <div
                        className="absolute inset-0 rounded-full border-[3px] border-primary/10 border-t-primary border-r-primary animate-loader-spin-slow"
                        style={{ filter: "drop-shadow(0 0 6px oklch(0.45 0.15 250 / 0.3))" }}
                    />
                    <div className="absolute inset-2 rounded-full border-[2.5px] border-secondary/10 border-b-secondary border-l-secondary animate-loader-spin-reverse" />
                    <div className="absolute inset-4 rounded-full border-2 border-primary/20 animate-loader-pulse-ring" />
                    <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 animate-loader-icon-float">
                        <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                </div>
                <div className={`flex ${direction === "col" ? "flex-col" : "flex-row"} items-center gap-2`}>
                    <p
                        className="text-sm font-semibold tracking-wide animate-loader-shimmer"
                        style={{
                            background: "linear-gradient(90deg, var(--color-muted-foreground) 0%, var(--color-foreground) 50%, var(--color-muted-foreground) 100%)",
                            backgroundSize: "200% auto",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        {text}
                    </p>
                    {direction === "col" && (
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    className="block w-1.5 h-1.5 rounded-full bg-primary/60 animate-loader-dot"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}