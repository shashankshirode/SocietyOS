import React, { createContext, useContext } from 'react';
import { dataSourceConfig } from './dataSource.config';
import type { DataSourceConfig } from './dataSource.types';

const DataSourceConfigContext = createContext<DataSourceConfig>(dataSourceConfig);

export function DataSourceProvider({
  children,
  value = dataSourceConfig,
}: {
  children: React.ReactNode;
  value?: DataSourceConfig;
}) {
  return (
    <DataSourceConfigContext.Provider value={value}>
      {children}
    </DataSourceConfigContext.Provider>
  );
}

export function useDataSourceConfig(): DataSourceConfig {
  return useContext(DataSourceConfigContext);
}

