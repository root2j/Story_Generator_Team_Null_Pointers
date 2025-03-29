import { useEffect, useState } from "react";

import {
  Repeat,
  MonitorSmartphone,
  Settings,
  Download,
  Maximize,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

// interface MediaPlayerProps {
//   src: string;
//   title: string;
//   artist?: string;
//   type: "audio" | "video";
// }

interface QualityOption {
  label: string;
  src: string;
}

interface ResponsiveButtonGroup {
  toggleLoop: () => void;
  isLoop: boolean;
  type: string;
  qualityOptions: QualityOption[];
  currentQuality: QualityOption;
  handleQualityChange: (quality: QualityOption) => void;
  setPlaybackRate: (rate: number) => void;
  handleDownload: () => void;
  toggleFullscreen: () => void;
}

const ResponsiveButtonGroup: React.FC<ResponsiveButtonGroup> = ({
  toggleLoop,
  isLoop,
  type,
  qualityOptions,
  currentQuality,
  handleQualityChange,
  setPlaybackRate,
  handleDownload,
  toggleFullscreen,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:scale-105 transition-transform"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleLoop}>
              <Repeat className="h-5 w-5 mr-2" /> Loop {isLoop && "(On)"}
            </DropdownMenuItem>
            {type === "video" && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <MonitorSmartphone className="h-5 w-5 mr-2" /> Quality
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {qualityOptions.map((quality) => (
                    <DropdownMenuItem
                      key={quality.label}
                      onClick={() => handleQualityChange(quality)}
                    >
                      {quality.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Settings className="h-5 w-5 mr-2" /> Playback Speed
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {[0.5, 1, 1.5, 2].map((speed) => (
                  <DropdownMenuItem
                    key={speed}
                    onClick={() => setPlaybackRate(speed)}
                  >
                    {speed}x Speed
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="h-5 w-5 mr-2" /> Download
            </DropdownMenuItem>
            {type === "video" && (
              <DropdownMenuItem onClick={toggleFullscreen}>
                <Maximize className="h-5 w-5 mr-2" /> Fullscreen
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLoop}
            className={`hover:scale-105 transition-transform ${isLoop ? "text-primary" : ""
              }`}
          >
            <Repeat className="h-5 w-5" />
          </Button>

          {type === "video" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:scale-105 transition-transform"
                >
                  <MonitorSmartphone className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Quality</DropdownMenuLabel>
                {qualityOptions.map((quality) => (
                  <DropdownMenuItem
                    key={quality.label}
                    onClick={() => handleQualityChange(quality)}
                    className={
                      quality.label === currentQuality.label ? "bg-accent" : ""
                    }
                  >
                    {quality.label}
                    {quality.label === currentQuality.label && " ✓"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-105 transition-transform"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
              {[0.5, 1, 1.5, 2].map((speed) => (
                <DropdownMenuItem
                  key={speed}
                  onClick={() => setPlaybackRate(speed)}
                >
                  {speed}x Speed
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="hover:scale-105 transition-transform"
          >
            <Download className="h-5 w-5" />
          </Button>

          {type === "video" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="hover:scale-105 transition-transform"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ResponsiveButtonGroup;
