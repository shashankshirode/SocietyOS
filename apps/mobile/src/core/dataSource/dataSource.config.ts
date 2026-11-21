import { DEFAULT_DATA_SOURCE_MODE } from './dataSource.constants';
import { moduleDataSourceOverrides } from './moduleDataSourceOverrides';
import type { DataSourceConfig, DataSourceMode } from './dataSource.types';
import type { Absent } from "../../shared/types/absence.types";
import { runtimePolicy } from '../config/runtimePolicy';

function isDataSourceMode(value: string | Absent): value is DataSourceMode {
    return value === 'mock' || value === 'api' || value === 'hybrid';
}

function resolveGlobalDataSourceMode(): DataSourceMode {
    const envMode = process.env.EXPO_PUBLIC_DATA_SOURCE_MODE;
    if (runtimePolicy.isProduction()) {
        if (envMode && envMode !== 'api') {
            throw new Error(`[SecurityPolicy] Production environment forbids non-API data source mode '${envMode}'.`);
        }
        return 'api';
    }
    return isDataSourceMode(envMode) ? envMode : DEFAULT_DATA_SOURCE_MODE;
}

const isProduction = runtimePolicy.isProduction() || process.env.EXPO_PUBLIC_DATA_SOURCE_MODE === 'api';

export const dataSourceConfig: DataSourceConfig = {
    globalMode: resolveGlobalDataSourceMode(),
    moduleOverrides: moduleDataSourceOverrides,
    allowApiFallbackToMock: false,
    enableMockLatency: !isProduction,
    enableMockErrors: false,
};

