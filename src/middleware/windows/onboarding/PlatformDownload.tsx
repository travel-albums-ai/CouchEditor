import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { Box, Divider, Stack } from '@mui/material';
import { useEffect, useState } from "react";

type OS =
  | "windows"
  | "macos"
  | "linux"
  | "android"
  | "ios"
  | "unknown";

type Architecture =
  | "x64"
  | "arm64"
  | "arm"
  | "x86"
  | "unknown";

export type PlatformInfo = {
  os: OS;
  architecture: Architecture;
  isMobile: boolean;
  isWindowsArm: boolean;
  isWindowsX64: boolean;
};

type UserAgentData = {
  platform?: string;
  architecture?: string;
  bitness?: string;
  model?: string;
  mobile?: boolean;
  getHighEntropyValues?: (
    hints: string[]
  ) => Promise<{
    platform?: string;
    architecture?: string;
    bitness?: string;
    model?: string;
    uaFullVersion?: string;
  }>;
};

function getUAData(): UserAgentData | undefined {
  return (
    navigator as Navigator & {
      userAgentData?: UserAgentData;
    }
  ).userAgentData;
}

function detectOS(uaData?: UserAgentData): OS {
  const ua = navigator.userAgent;

  const platform = uaData?.platform?.toLowerCase() ?? "";
  const navPlatform = navigator.platform?.toLowerCase() ?? "";

  if (
    platform.includes("windows") ||
    navPlatform.includes("win") ||
    /windows/i.test(ua)
  ) {
    return "windows";
  }

  if (
    platform.includes("mac") ||
    navPlatform.includes("mac") ||
    /macintosh|mac os x/i.test(ua)
  ) {
    return "macos";
  }

  if (/android/i.test(ua)) {
    return "android";
  }

  if (/iphone|ipad|ipod/i.test(ua)) {
    return "ios";
  }

  if (/linux/i.test(ua)) {
    return "linux";
  }

  return "unknown";
}

function normalizeArchitecture(value?: string): Architecture {
  switch (value?.toLowerCase()) {
    case "arm":
      return "arm64";

    case "arm64":
    case "aarch64":
      return "arm64";

    case "x86":
    case "ia32":
      return "x86";

    case "x86-64":
    case "x86_64":
    case "x64":
    case "amd64":
      return "x64";

    default:
      return "unknown";
  }
}

async function detectArchitecture(os: OS): Promise<Architecture> {
  const ua = navigator.userAgent;
  const uaData = getUAData();

  if (uaData?.getHighEntropyValues) {
    try {
      const data = await uaData.getHighEntropyValues([
        "architecture",
        "bitness",
        "model",
        "platform",
      ]);

      const architecture = normalizeArchitecture(data.architecture);

      if (architecture !== "unknown") {
        if (architecture === "arm64") {
          return "arm64";
        }

        if (os === "windows") {
          const model = data.model?.toLowerCase() ?? "";

          if (
            /snapdragon|qualcomm|microsoft sq|surface pro x|surface pro 9|surface laptop/i.test(
              model
            )
          ) {
            return "arm64";
          }
        }

        return architecture;
      }
    } catch {
      // Fall through to UA detection.
    }
  }

  if (/arm64|aarch64/i.test(ua)) {
    return "arm64";
  }

  if (/\barm\b/i.test(ua)) {
    return "arm64";
  }

  if (os === "windows") {
    const platform = navigator.platform?.toLowerCase() ?? "";

    if (/arm64|aarch64|arm/i.test(platform)) {
      return "arm64";
    }

    if (
      /snapdragon|qualcomm|surface pro x|surface pro 9|surface laptop 7|copilot\+ pc/i.test(
        ua
      )
    ) {
      return "arm64";
    }
  }

  if (/x86_64|win64|wow64|x64|amd64/i.test(ua)) {
    return "x64";
  }

  if (/x86|i[3-6]86|ia32/i.test(ua)) {
    return "x86";
  }

  if (os === "macos") {
    /*
     * Intel Macs explicitly contain "Intel Mac".
     */
    if (/intel mac/i.test(ua)) {
      return "x64";
    }

    /*
     * Modern Macs are Apple Silicon unless explicitly Intel.
     */
    return "arm64";
  }

  return "unknown";
}

export async function detectPlatform(): Promise<PlatformInfo> {
  const uaData = getUAData();

  const os = detectOS(uaData);
  const architecture = await detectArchitecture(os);

  return {
    os,
    architecture,
    isMobile:
      uaData?.mobile ??
      /android|iphone|ipad|ipod/i.test(navigator.userAgent),

    isWindowsArm: os === "windows" && architecture === "arm64",
    isWindowsX64: os === "windows" && architecture === "x64",
  };
}

export function usePlatform(): PlatformInfo | null {
  const [platform, setPlatform] = useState<PlatformInfo | null>(null);

  useEffect(() => {
    let cancelled = false;

    detectPlatform().then((result) => {
      if (!cancelled) {
        setPlatform(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return platform;
}

export function PlatformDownloadButton() {
  const platform = usePlatform();

  if (!platform) {
    return null;
  }

  const downloadUrlButton = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() ?? "download";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };


  return (<>
    <Stack direction={'row'} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }} divider={<Divider orientation="vertical" flexItem />}>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GenericToggleButtonGroup  items={[
          {
            tooltip: "Download for Windows",
            icon: <span>🏢</span>,
            title: 'arm64',
            selected: false,
          },
          {
            tooltip: "Download for Windows",
            icon: <span>🪟</span>,
            selected: platform.os === "windows" && platform.architecture === "arm64",
            onClick: () => {
              downloadUrlButton("https://github.com/travel-albums-ai/albums-google-photos-indexer/releases/latest/download/TravelAlbums-windows-arm64.zip");
            }
          },
          {
            tooltip: "Download for macOS",
            icon: <span>🍎</span>,
            selected: platform.os === "macos" && platform.architecture === "arm64",
            onClick: () => {
              downloadUrlButton("https://github.com/travel-albums-ai/albums-google-photos-indexer/releases/latest/download/TravelAlbums-macos-arm64.tar.gz");
            }
          },
          {
            tooltip: "Download for Linux",
            icon: <span>🐧</span>,
            selected: platform.os === "linux" && platform.architecture === "arm64",
            onClick: () => {
              downloadUrlButton("https://github.com/travel-albums-ai/albums-google-photos-indexer/releases/latest/download/TravelAlbums-ubuntu-arm64.tar.gz");
            }
          }
        ] satisfies GenericToggleButtonProps[]} />

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GenericToggleButtonGroup  items={[
          {
            tooltip: "Download for Windows",
            icon: <span>🏛️</span>,
            title: 'arm64',
            selected: false,
          },
          {
            tooltip: "Download for Windows",
            icon: <span>🪟</span>,
            selected: platform.os === "windows" && platform.architecture === "x64",
            onClick: () => {
              downloadUrlButton("https://github.com/travel-albums-ai/albums-google-photos-indexer/releases/latest/download/TravelAlbums-windows-x64.zip");
            }
          },
          {
            tooltip: "Download for macOS",
            icon: <span>🍎</span>,
            selected: platform.os === "macos" && platform.architecture === "x64",
            onClick: () => {
              downloadUrlButton("https://github.com/travel-albums-ai/albums-google-photos-indexer/releases/latest/download/TravelAlbums-macos-x64.tar.gz");
            }
          },
          {
            tooltip: "Download for Linux",
            icon: <span>🐧</span>,
            selected: platform.os === "linux" && platform.architecture === "x64",
            onClick: () => {
              downloadUrlButton("https://github.com/travel-albums-ai/albums-google-photos-indexer/releases/latest/download/TravelAlbums-ubuntu-x64.tar.gz");
            }
          }
        ] satisfies GenericToggleButtonProps[]} />
      </Box>

    </Stack>
  </>
  );
}
