import { DEFAULT_DATA_SOURCE_MODE } from './dataSource.constants';
import { moduleDataSourceOverrides } from './moduleDataSourceOverrides';
import type { DataSourceConfig, DataSourceMode } from './dataSource.types';
import type { Absent } from "../../shared/types/absence.types";
function isDataSourceMode(value: string | Absent): value is DataSourceMode {
    return value === 'mock' || value === 'api' || value === 'hybrid';
}
const envMode = process.env.EXPO_PUBLIC_DATA_SOURCE_MODE;
export const dataSourceConfig: DataSourceConfig = {
    globalMode: isDataSourceMode(envMode) ? envMode : DEFAULT_DATA_SOURCE_MODE,
    moduleOverrides: moduleDataSourceOverrides,
    allowApiFallbackToMock: true,
    enableMockLatency: true,
    enableMockErrors: false,
};

