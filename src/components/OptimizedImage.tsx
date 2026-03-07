import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  width,
  height,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === "eager");
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading === "eager") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [loading]);

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-inherit" />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "w-full h-full object-contain transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}
