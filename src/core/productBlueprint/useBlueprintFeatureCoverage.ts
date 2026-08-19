import { useMemo, useState } from 'react';
import type {  BlueprintPhase, BlueprintFeatureStatus } from './blueprintFeature.types';
import { blueprintFeatures } from './blueprintFeatureRegistry';
import { blueprintCoverageValidator } from './blueprintCoverageValidator';

export function useBlueprintFeatureCoverage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<BlueprintPhase | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<BlueprintFeatureStatus | 'ALL'>('ALL');

  const stats = useMemo(() => {
    return blueprintCoverageValidator(blueprintFeatures);
  }, []);

  const filteredFeatures = useMemo(() => {
    return blueprintFeatures.filter((feature) => {
      const matchesSearch =
        feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.moduleName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPhase = selectedPhase === 'ALL' || feature.phase === selectedPhase;
      const matchesStatus = selectedStatus === 'ALL' || feature.status === selectedStatus;

      return matchesSearch && matchesPhase && matchesStatus;
    });
  }, [searchQuery, selectedPhase, selectedStatus]);

  return {
    features: filteredFeatures,
    stats,
    searchQuery,
    setSearchQuery,
    selectedPhase,
    setSelectedPhase,
    selectedStatus,
    setSelectedStatus,
  };
}
