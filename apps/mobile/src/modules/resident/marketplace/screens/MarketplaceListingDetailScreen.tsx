import React from 'react';
import { BorrowableItemDetailScreen } from '../../../community/screens/BorrowableItemDetailScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CommunityStackParamList } from '../../../../app/navigation/navigation.types';

type MarketplaceListingDetailScreenProps = NativeStackScreenProps<CommunityStackParamList, 'BorrowableItemDetail'>;

export function MarketplaceListingDetailScreen(props: MarketplaceListingDetailScreenProps) {
  return <BorrowableItemDetailScreen {...props} />;
}
export default MarketplaceListingDetailScreen;
