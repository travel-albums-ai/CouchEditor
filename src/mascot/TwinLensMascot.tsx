import type { CSSProperties, SVGProps } from 'react';
import { useEffect, useRef, useState } from 'react';

export interface TwinLensMascotProps extends SVGProps<SVGSVGElement> {
  loading?: boolean;

  mascotTransform?: string;

  leftEyeTransform?: string;
  rightEyeTransform?: string;

  leftLegTransform?: string;
  rightLegTransform?: string;

  leftFootTransform?: string;
  rightFootTransform?: string;

  eyeFollowDistance?: number;

  style?: CSSProperties;
}

interface EyePosition {
  x: number;
  y: number;
}

const VIEWBOX_WIDTH = 320;
const VIEWBOX_HEIGHT = 320;

const LEFT_EYE: EyePosition = {
  x: 111,
  y: 151,
};

const RIGHT_EYE: EyePosition = {
  x: 209,
  y: 151,
};

export function TwinLensMascot({
  loading = false,
  mascotTransform,
  leftEyeTransform = '',
  rightEyeTransform = '',
  leftLegTransform = '',
  rightLegTransform = '',
  leftFootTransform = '',
  rightFootTransform = '',
  eyeFollowDistance = 5,
  style,
  ...svgProps
}: TwinLensMascotProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const [eyeOffset, setEyeOffset] = useState({
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  });

  useEffect(() => {
    let frame = 0;

    const handleMouseMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const svg = svgRef.current;

        if (!svg) return;

        const rect = svg.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const scaleX = rect.width / VIEWBOX_WIDTH;
        const scaleY = rect.height / VIEWBOX_HEIGHT;

        const getEyeOffset = (eye: EyePosition) => {
          const eyeScreenX =
            rect.left + eye.x * scaleX;

          const eyeScreenY =
            rect.top + eye.y * scaleY;

          const dx = event.clientX - eyeScreenX;
          const dy = event.clientY - eyeScreenY;

          const distance = Math.sqrt(
            dx * dx + dy * dy,
          );

          if (distance === 0) {
            return { x: 0, y: 0 };
          }

          const nx = dx / distance;
          const ny = dy / distance;

          return {
            x: nx * eyeFollowDistance,
            y: ny * eyeFollowDistance,
          };
        };

        setEyeOffset({
          left: getEyeOffset(LEFT_EYE),
          right: getEyeOffset(RIGHT_EYE),
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frame);
    };
  }, [eyeFollowDistance]);

  return (
    <>
      <style>
        {`
          @keyframes twinLensLeftLegShake {
            0%, 100% {
              transform: rotate(0deg);
            }

            20% {
              transform: rotate(12deg);
            }

            40% {
              transform: rotate(-10deg);
            }

            60% {
              transform: rotate(14deg);
            }

            80% {
              transform: rotate(-7deg);
            }
          }

          @keyframes twinLensRightLegShake {
            0%, 100% {
              transform: rotate(0deg);
            }

            20% {
              transform: rotate(-12deg);
            }

            40% {
              transform: rotate(10deg);
            }

            60% {
              transform: rotate(-14deg);
            }

            80% {
              transform: rotate(7deg);
            }
          }

          @keyframes twinLensLeftFootShake {
            0%, 100% {
              transform: rotate(0deg);
            }

            50% {
              transform: rotate(-8deg);
            }
          }

          @keyframes twinLensRightFootShake {
            0%, 100% {
              transform: rotate(0deg);
            }

            50% {
              transform: rotate(8deg);
            }
          }

          .twin-lens-mascot-loading-left-leg {
            animation:
              twinLensLeftLegShake
              0.45s
              ease-in-out
              infinite;
            transform-box: fill-box;
            transform-origin: top center;
          }

          .twin-lens-mascot-loading-right-leg {
            animation:
              twinLensRightLegShake
              0.45s
              ease-in-out
              infinite;
            transform-box: fill-box;
            transform-origin: top center;
          }

          .twin-lens-mascot-loading-left-foot {
            animation:
              twinLensLeftFootShake
              0.45s
              ease-in-out
              infinite;
            transform-box: fill-box;
            transform-origin: center;
          }

          .twin-lens-mascot-loading-right-foot {
            animation:
              twinLensRightFootShake
              0.45s
              ease-in-out
              infinite;
            transform-box: fill-box;
            transform-origin: center;
          }
        `}
      </style>

      <svg
        ref={svgRef}
        viewBox="0 0 320 320"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Twin lens camera mascot"
        {...svgProps}
        style={{
          overflow: 'visible',
          ...style,
        }}
      >
        <g
          id="mascot"
          transform={mascotTransform}
          stroke="#171717"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* ==========================================================
              SHADOW
          ========================================================== */}

          <ellipse
            id="shadow"
            cx="160"
            cy="286"
            rx="105"
            ry="9"
            fill="#000"
            opacity="0.12"
            stroke="none"
          />

          {/* ==========================================================
              LEGS
          ========================================================== */}

          <g
            id="legs"
            fill="none"
            stroke="#202020"
            strokeWidth="13"
          >
            <g
              id="left-leg"
              className={
                loading
                  ? 'twin-lens-mascot-loading-left-leg'
                  : undefined
              }
              transform={leftLegTransform}
            >
              <path
                d="
                  M 108 205
                  C 108 218, 119 222, 114 235
                  C 110 246, 95 243, 96 255
                  C 97 266, 88 270, 82 274
                "
              />
            </g>

            <g
              id="right-leg"
              className={
                loading
                  ? 'twin-lens-mascot-loading-right-leg'
                  : undefined
              }
              transform={rightLegTransform}
            >
              <path
                d="
                  M 212 205
                  C 212 219, 201 223, 206 236
                  C 210 247, 225 244, 224 256
                  C 223 267, 233 271, 239 274
                "
              />
            </g>
          </g>

          {/* ==========================================================
              FEET
          ========================================================== */}

          <g
            id="feet"
            fill="#202020"
            strokeWidth="4"
          >
            <g
              id="left-foot"
              className={
                loading
                  ? 'twin-lens-mascot-loading-left-foot'
                  : undefined
              }
              transform={leftFootTransform}
            >
              <path
                d="
                  M 80 267
                  C 72 269, 66 275, 68 281
                  C 70 288, 84 291, 96 288
                  C 103 286, 105 280, 99 275
                  C 94 271, 87 268, 80 267
                  Z
                "
              />
            </g>

            <g
              id="right-foot"
              className={
                loading
                  ? 'twin-lens-mascot-loading-right-foot'
                  : undefined
              }
              transform={rightFootTransform}
            >
              <path
                d="
                  M 239 267
                  C 247 269, 254 275, 252 281
                  C 250 288, 236 291, 224 288
                  C 217 286, 215 280, 221 275
                  C 226 271, 233 268, 239 267
                  Z
                "
              />
            </g>
          </g>

          {/* ==========================================================
              CAMERA BODY
          ========================================================== */}

          <g id="camera">
            <rect
              id="camera-body"
              x="42"
              y="93"
              width="236"
              height="116"
              rx="14"
              fill="#303030"
              strokeWidth="5"
            />

            <path
              d="
                M 45 103
                Q 45 93 57 93
                H 263
                Q 275 93 275 103
                V 119
                H 45
                Z
              "
              fill="#d7d4ce"
              strokeWidth="4"
            />

            <path
              d="
                M 48 119
                H 272
                V 199
                Q 272 205 264 205
                H 56
                Q 48 205 48 199
                Z
              "
              fill="#242424"
              stroke="none"
            />

            <path
              d="
                M 44 190
                H 276
                V 201
                Q 276 207 268 207
                H 52
                Q 44 207 44 201
                Z
              "
              fill="#aaa7a0"
              strokeWidth="3"
            />

            {/* Viewfinder */}
            <g id="viewfinder">
              <path
                d="
                  M 118 93
                  L 130 69
                  H 190
                  L 202 93
                  Z
                "
                fill="#c9c6c0"
                strokeWidth="4"
              />

              <path
                d="
                  M 136 72
                  H 184
                  L 191 91
                  H 129
                  Z
                "
                fill="#e2dfd8"
                strokeWidth="3"
              />

              <rect
                x="151"
                y="59"
                width="18"
                height="10"
                rx="3"
                fill="#252525"
                strokeWidth="3"
              />
            </g>

            {/* Controls */}
            <g id="controls">
              <circle
                cx="68"
                cy="106"
                r="13"
                fill="#bcb9b2"
                strokeWidth="4"
              />

              <circle
                cx="68"
                cy="106"
                r="7"
                fill="#303030"
                strokeWidth="2"
              />

              <circle
                cx="244"
                cy="106"
                r="11"
                fill="#bcb9b2"
                strokeWidth="4"
              />

              <circle
                cx="244"
                cy="106"
                r="5"
                fill="#303030"
                strokeWidth="2"
              />

              <rect
                x="92"
                y="99"
                width="24"
                height="12"
                rx="4"
                fill="#252525"
                strokeWidth="3"
              />

              <rect
                x="204"
                y="99"
                width="24"
                height="12"
                rx="4"
                fill="#252525"
                strokeWidth="3"
              />
            </g>

            {/* Left eye */}
            <g
              id="left-eye"
              transform={leftEyeTransform}
            >
              <circle
                cx="111"
                cy="151"
                r="45"
                fill="#171717"
                strokeWidth="5"
              />

              <circle
                cx="111"
                cy="151"
                r="37"
                fill="#d6d3cc"
                strokeWidth="4"
              />

              <circle
                cx="111"
                cy="151"
                r="29"
                fill="#202020"
                strokeWidth="4"
              />

              <circle
                cx="111"
                cy="151"
                r="22"
                fill="#101a20"
                strokeWidth="3"
              />

              <g
                id="left-pupil"
                transform={`
                  translate(
                    ${eyeOffset.left.x}
                    ${eyeOffset.left.y}
                  )
                `}
              >
                <circle
                  cx="111"
                  cy="151"
                  r="10"
                  fill="#070b0d"
                  stroke="none"
                />

                <ellipse
                  cx="103"
                  cy="142"
                  rx="6"
                  ry="4"
                  fill="#fff"
                  opacity="0.9"
                  stroke="none"
                />
              </g>

              <path
                d="M 119 165 Q 125 160 126 153"
                fill="none"
                stroke="#6d8490"
                strokeWidth="3"
                opacity="0.7"
              />
            </g>

            {/* Right eye */}
            <g
              id="right-eye"
              transform={rightEyeTransform}
            >
              <circle
                cx="209"
                cy="151"
                r="45"
                fill="#171717"
                strokeWidth="5"
              />

              <circle
                cx="209"
                cy="151"
                r="37"
                fill="#d6d3cc"
                strokeWidth="4"
              />

              <circle
                cx="209"
                cy="151"
                r="29"
                fill="#202020"
                strokeWidth="4"
              />

              <circle
                cx="209"
                cy="151"
                r="22"
                fill="#101a20"
                strokeWidth="3"
              />

              <g
                id="right-pupil"
                transform={`
                  translate(
                    ${eyeOffset.right.x}
                    ${eyeOffset.right.y}
                  )
                `}
              >
                <circle
                  cx="209"
                  cy="151"
                  r="10"
                  fill="#070b0d"
                  stroke="none"
                />

                <ellipse
                  cx="201"
                  cy="142"
                  rx="6"
                  ry="4"
                  fill="#fff"
                  opacity="0.9"
                  stroke="none"
                />
              </g>

              <path
                d="M 217 165 Q 223 160 224 153"
                fill="none"
                stroke="#6d8490"
                strokeWidth="3"
                opacity="0.7"
              />
            </g>

            {/* Details */}
            <g id="camera-details">
              <circle
                cx="45"
                cy="128"
                r="5"
                fill="#aaa7a0"
                strokeWidth="3"
              />

              <circle
                cx="275"
                cy="128"
                r="5"
                fill="#aaa7a0"
                strokeWidth="3"
              />

              <circle
                cx="67"
                cy="178"
                r="7"
                fill="#aaa7a0"
                strokeWidth="3"
              />

              <circle
                cx="252"
                cy="181"
                r="3"
                fill="#aaa7a0"
                strokeWidth="2"
              />
            </g>
          </g>
        </g>
      </svg>
    </>
  );
}

export default TwinLensMascot;
