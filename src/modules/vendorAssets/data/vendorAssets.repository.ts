import { appConfig } from '../../../core/config/appConfig';
import { vendorAssetsApiSource } from './vendorAssets.apiSource';
import { vendorAssetsMockSource } from './vendorAssets.mockSource';

export const vendorAssetsRepository =
  appConfig.dataSourceMode === 'api' ? vendorAssetsApiSource : vendorAssetsMockSource;
export default vendorAssetsRepository;
