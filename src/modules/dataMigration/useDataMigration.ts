import { useState, useEffect, useCallback, useRef } from 'react';
import { dataMigrationEngine, type ImportTemplate, type ImportBatch, type ImportRowResult, type ImportPreview, type ExportConfig, type ExportJob } from './dataMigrationEngine';

export function useDataMigration() {
  const [templates, setTemplates] = useState<ImportTemplate[]>([]);
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [currentBatch, setCurrentBatch] = useState<ImportBatch | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [rowResults, setRowResults] = useState<ImportRowResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setTemplates(dataMigrationEngine.getTemplates());
    setBatches(dataMigrationEngine.getAllBatches());

    unsubscribeRef.current = dataMigrationEngine.onBatchUpdate((batch) => {
      setBatches(prev => {
        const idx = prev.findIndex(b => b.id === batch.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = batch;
          return next;
        }
        return [...prev, batch];
      });
      if (currentBatch?.id === batch.id) {
        setCurrentBatch(batch);
      }
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [currentBatch?.id]);

  const uploadFile = useCallback(async (
    file: File,
    templateId: string,
    societyId: string,
    uploadedBy: string
  ) => {
    return dataMigrationEngine.uploadFile(file, templateId, societyId, uploadedBy);
  }, []);

  const validateBatch = useCallback(async (batchId: string) => {
    setIsValidating(true);
    try {
      const results = await dataMigrationEngine.validateBatch(batchId);
      setRowResults(results);
      const batch = dataMigrationEngine.getBatch(batchId);
      if (batch) setCurrentBatch(batch);
      return results;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const generatePreview = useCallback((batchId: string) => {
    const previewData = dataMigrationEngine.generatePreview(batchId);
    setPreview(previewData);
    return previewData;
  }, []);

  const commitBatch = useCallback(async (batchId: string, force?: boolean) => {
    setIsCommitting(true);
    try {
      const result = await dataMigrationEngine.commitBatch(batchId, { ...(force !== undefined ? { force } : {}) });
      const batch = dataMigrationEngine.getBatch(batchId);
      if (batch) setCurrentBatch(batch);
      return result;
    } finally {
      setIsCommitting(false);
    }
  }, []);

  const rollbackBatch = useCallback(async (batchId: string) => {
    await dataMigrationEngine.rollbackBatch(batchId);
    const batch = dataMigrationEngine.getBatch(batchId);
    if (batch) setCurrentBatch(batch);
  }, []);

  const loadBatch = useCallback((batchId: string) => {
    const batch = dataMigrationEngine.getBatch(batchId);
    if (batch) {
      setCurrentBatch(batch);
      setRowResults(dataMigrationEngine.getRowResults(batchId));
      setPreview(dataMigrationEngine.generatePreview(batchId));
    }
  }, []);

  const exportData = useCallback(async (
    config: ExportConfig,
    societyId: string,
    requestedBy: string
  ) => {
    return dataMigrationEngine.exportData(config, societyId, requestedBy);
  }, []);

  const getExportJob = useCallback((jobId: string) => {
    return dataMigrationEngine.getExportJob(jobId);
  }, []);

  return {
    templates,
    batches,
    currentBatch,
    preview,
    rowResults,
    isValidating,
    isCommitting,
    exportJobs,
    uploadFile,
    validateBatch,
    generatePreview,
    commitBatch,
    rollbackBatch,
    loadBatch,
    exportData,
    getExportJob,
  };
}

export function useImportBatch(batchId: string | null) {
  const [batch, setBatch] = useState<ImportBatch | null>(null);
  const [results, setResults] = useState<ImportRowResult[]>([]);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!batchId) return;

    const batchData = dataMigrationEngine.getBatch(batchId);
    if (batchData) {
      setBatch(batchData);
      setResults(dataMigrationEngine.getRowResults(batchId));
      setPreview(dataMigrationEngine.generatePreview(batchId));
    }

    unsubscribeRef.current = dataMigrationEngine.onBatchUpdate((updatedBatch) => {
      if (updatedBatch.id === batchId) {
        setBatch(updatedBatch);
      }
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [batchId]);

  return { batch, results, preview };
}