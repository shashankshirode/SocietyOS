export type EmergencyLensFrame = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type EmergencyLensLayout = {
  lensSize: number;
  coreSize: number;
  showDescriptions: boolean;
  territories: Record<string, EmergencyLensFrame>;
  core: EmergencyLensFrame;
};

type Point = { x: number; y: number };

const normalizedCenters: Record<string, Point> = {
  medical: { x: 0.5, y: 0.14 },
  fire: { x: 0.2, y: 0.38 },
  securityThreat: { x: 0.8, y: 0.38 },
  liftStuck: { x: 0.24, y: 0.76 },
  seniorHelp: { x: 0.76, y: 0.76 },
};

function intersects(first: EmergencyLensFrame, second: EmergencyLensFrame, padding: number): boolean {
  return first.left < second.left + second.width + padding &&
    first.left + first.width + padding > second.left &&
    first.top < second.top + second.height + padding &&
    first.top + first.height + padding > second.top;
}

function frameFor(center: Point, size: number, width: number, height: number, padding: number): EmergencyLensFrame {
  return {
    left: Math.max(padding, Math.min(size - width - padding, center.x * size - width / 2)),
    top: Math.max(padding, Math.min(size - height - padding, center.y * size - height / 2)),
    width,
    height,
  };
}

export function resolveEmergencyLensLayout(input: {
  containerWidth: number;
  containerHeight?: number;
  fontScale?: number;
}): EmergencyLensLayout {
  const availableWidth = Math.max(240, input.containerWidth);
  const availableHeight = input.containerHeight && input.containerHeight > 0 ? input.containerHeight : availableWidth;
  const compact = availableWidth <= 360 || availableHeight <= 600 || (input.fontScale ?? 1) >= 1.5;
  const lensSize = Math.min(availableWidth, availableHeight, compact ? 320 : 380);
  const coreSize = compact ? 92 : Math.min(116, Math.max(100, lensSize * 0.3));
  const territoryWidth = compact ? 76 : 106;
  const territoryHeight = compact ? 54 : 68;
  const edgePadding = compact ? 8 : 10;
  const core = frameFor({ x: 0.5, y: 0.51 }, coreSize, coreSize, coreSize, 0);
  const coreBounds = { ...core, left: (lensSize - coreSize) / 2, top: (lensSize - coreSize) / 2 };
  const territories: Record<string, EmergencyLensFrame> = {};

  for (const [type, center] of Object.entries(normalizedCenters)) {
    let frame = frameFor(center, lensSize, territoryWidth, territoryHeight, edgePadding);
    if (intersects(frame, coreBounds, 8)) {
      const direction = center.x < 0.5 ? -1 : 1;
      frame = frameFor({ x: center.x + direction * 0.08, y: center.y }, lensSize, territoryWidth, territoryHeight, edgePadding);
    }
    for (const existing of Object.values(territories)) {
      if (intersects(frame, existing, 6)) {
        frame = frameFor({ x: center.x, y: center.y + (center.y < 0.5 ? -0.08 : 0.08) }, lensSize, territoryWidth, territoryHeight, edgePadding);
      }
    }
    territories[type] = frame;
  }

  return {
    lensSize,
    coreSize,
    showDescriptions: !compact && lensSize >= 340,
    territories,
    core: coreBounds,
  };
}
