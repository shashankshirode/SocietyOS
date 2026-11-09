/**
 * Temporal Module - Central Temporal Architecture for Society OS
 * 
 * This module provides the canonical temporal architecture for the entire platform.
 * It enforces strict separation between society business time and viewer display time.
 * 
 * DO NOT use direct date formatting in components. Use the temporal service/hooks.
 */

export * from './temporal.types';
export * from './temporal.service';
export * from './useTemporalContext';
