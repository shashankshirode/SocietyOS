import { StyleSheet } from 'react-native';
import type { PulseLabelAnchor } from '../../components/PulseLayoutEngine';

export const createLabelBackgroundStyle = (backgroundColor: string) => ({ backgroundColor });
export const createLabelSelectedStyle = (borderColor: string) => ({ borderColor });
export const createNodeStyle = (backgroundColor: string, selected: boolean) => ({ backgroundColor, transform: [{ scale: selected ? 1.35 : 1 }] });
export const createTextColorStyle = (color: string) => ({ color });
export const createHaloStyle = (borderColor: string) => ({ borderColor });
export const createNodeLayoutStyle = (nodeX: number, nodeY: number) => ({ left: nodeX - 22, top: nodeY - 22 });
export const createLabelLayoutStyle = (left: number, top: number, width: number, height: number) => ({ left, top, width, minHeight: height });
export function createConnectorStyle(nodeX: number, nodeY: number, anchor: PulseLabelAnchor, length: number, backgroundColor: string) {
  if (anchor === 'left' || anchor === 'outerLeft') return { left: nodeX - length, top: nodeY - 0.5, width: length, height: 1, backgroundColor } as const;
  if (anchor === 'right' || anchor === 'outerRight') return { left: nodeX, top: nodeY - 0.5, width: length, height: 1, backgroundColor } as const;
  if (anchor === 'above') return { left: nodeX - 0.5, top: nodeY - length, width: 1, height: length, backgroundColor } as const;
  return { left: nodeX - 0.5, top: nodeY, width: 1, height: length, backgroundColor } as const;
}

export const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFill },
  label: {
    position: 'absolute',
    borderRadius: 14,
    backgroundColor: '#FBF9F3',
    borderWidth: 1,
    borderColor: 'rgba(23, 32, 25, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    justifyContent: 'center',
    gap: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  labelSelected: { borderWidth: 1.5 },
  connector: { position: 'absolute', opacity: 0.52 },
  connectorSelected: { opacity: 0.92 },
  nodeTarget: { position: 'absolute', width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  node: { width: 10, height: 10, borderRadius: 5 },
  nodeHalo: { position: 'absolute', width: 20, height: 20, borderRadius: 10, borderWidth: 1, opacity: 0.28 },
  time: { letterSpacing: 0.2, fontWeight: '700' },
  title: { fontWeight: '700', color: '#172019' },
});

