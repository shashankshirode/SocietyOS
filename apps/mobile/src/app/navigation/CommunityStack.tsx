import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { CommunityStackParamList } from './navigation.types';

import { CommunityHomeScreen } from '../../modules/community/screens/CommunityHomeScreen';
import { MarketplaceListingFeedScreen } from '../../modules/community/screens/MarketplaceListingFeedScreen';
import { MarketplaceListingDetailScreen } from '../../modules/community/screens/MarketplaceListingDetailScreen';
import { CreateMarketplaceListingScreen } from '../../modules/community/screens/CreateMarketplaceListingScreen';
import { MyMarketplaceListingsScreen } from '../../modules/community/screens/MyMarketplaceListingsScreen';
import { EditMarketplaceListingScreen } from '../../modules/community/screens/EditPauseListingPlaceholderScreen';
import { ListingCategoryScreen } from '../../modules/community/screens/ListingCategoryScreen';
import { ListingSearchFiltersScreen } from '../../modules/community/screens/ListingSearchFiltersScreen';
import { ResidentSkillDirectoryScreen } from '../../modules/community/screens/ResidentSkillDirectoryScreen';
import { SkillProfileDetailScreen } from '../../modules/community/screens/SkillProfileDetailScreen';
import { CreateSkillProfileScreen } from '../../modules/community/screens/CreateSkillProfileScreen';
import { ResidentServiceListingScreen } from '../../modules/community/screens/ResidentServiceListingScreen';
import { ServiceRequestDetailScreen } from '../../modules/community/screens/ServiceRequestDetailScreen';
import { CreateServiceRequestScreen } from '../../modules/community/screens/CreateServiceRequestScreen';
import { CommunityContactRequestScreen } from '../../modules/community/screens/CommunityContactRequestScreen';
import { BorrowLendHomeScreen } from '../../modules/community/screens/BorrowLendHomeScreen';
import { BorrowableItemListScreen } from '../../modules/community/screens/BorrowableItemListScreen';
import { BorrowableItemDetailScreen } from '../../modules/community/screens/BorrowableItemDetailScreen';
import { CreateBorrowableItemScreen } from '../../modules/community/screens/CreateBorrowableItemScreen';
import { MyBorrowableItemsScreen } from '../../modules/community/screens/MyBorrowableItemsScreen';
import { BorrowRequestScreen } from '../../modules/community/screens/BorrowRequestScreen';
import { BorrowRequestDetailScreen } from '../../modules/community/screens/BorrowRequestDetailScreen';
import { BorrowApprovalScreen } from '../../modules/community/screens/BorrowApprovalScreen';
import { ReturnConfirmationScreen } from '../../modules/community/screens/ReturnConfirmationScreen';
import { BorrowLendHistoryScreen } from '../../modules/community/screens/BorrowLendHistoryScreen';
import { LostFoundListScreen } from '../../modules/community/screens/LostFoundListScreen';
import { LostFoundDetailScreen } from '../../modules/community/screens/LostFoundDetailScreen';
import { CreateLostFoundReportScreen } from '../../modules/community/screens/CreateLostFoundReportScreen';
import { VerifiedVendorsScreen } from '../../modules/community/screens/VerifiedVendorPlaceholderScreen';
import { ReportListingScreen } from '../../modules/community/screens/ReportListingScreen';
import { CommunitySafetyGuidelinesScreen } from '../../modules/community/screens/CommunitySafetyGuidelinesScreen';

const Stack = createNativeStackNavigator<CommunityStackParamList>();

const communityStackScreenOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  animationDuration: 250,
};

export function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={communityStackScreenOptions}>
      <Stack.Screen name="CommunityHome" component={CommunityHomeScreen} />
      <Stack.Screen name="MarketplaceListingFeed" component={MarketplaceListingFeedScreen} />
      <Stack.Screen name="MarketplaceListingDetail" component={MarketplaceListingDetailScreen} />
      <Stack.Screen name="CreateMarketplaceListing" component={CreateMarketplaceListingScreen} />
      <Stack.Screen name="MyMarketplaceListings" component={MyMarketplaceListingsScreen} />
      <Stack.Screen name="EditMarketplaceListing" component={EditMarketplaceListingScreen} />
      <Stack.Screen name="ListingCategory" component={ListingCategoryScreen} />
      <Stack.Screen name="ListingSearchFilters" component={ListingSearchFiltersScreen} />
      <Stack.Screen name="ReportListing" component={ReportListingScreen} />
      <Stack.Screen name="ResidentSkillDirectory" component={ResidentSkillDirectoryScreen} />
      <Stack.Screen name="SkillProfileDetail" component={SkillProfileDetailScreen} />
      <Stack.Screen name="CreateSkillProfile" component={CreateSkillProfileScreen} />
      <Stack.Screen name="ResidentServiceListing" component={ResidentServiceListingScreen} />
      <Stack.Screen name="ServiceRequestDetail" component={ServiceRequestDetailScreen} />
      <Stack.Screen name="CreateServiceRequest" component={CreateServiceRequestScreen} />
      <Stack.Screen name="BorrowLendHome" component={BorrowLendHomeScreen} />
      <Stack.Screen name="BorrowableItemList" component={BorrowableItemListScreen} />
      <Stack.Screen name="BorrowableItemDetail" component={BorrowableItemDetailScreen} />
      <Stack.Screen name="CreateBorrowableItem" component={CreateBorrowableItemScreen} />
      <Stack.Screen name="MyBorrowableItems" component={MyBorrowableItemsScreen} />
      <Stack.Screen name="BorrowRequest" component={BorrowRequestScreen} />
      <Stack.Screen name="BorrowRequestDetail" component={BorrowRequestDetailScreen} />
      <Stack.Screen name="BorrowApproval" component={BorrowApprovalScreen} />
      <Stack.Screen name="ReturnConfirmation" component={ReturnConfirmationScreen} />
      <Stack.Screen name="BorrowLendHistory" component={BorrowLendHistoryScreen} />
      <Stack.Screen name="LostFoundList" component={LostFoundListScreen} />
      <Stack.Screen name="LostFoundDetail" component={LostFoundDetailScreen} />
      <Stack.Screen name="CreateLostFoundReport" component={CreateLostFoundReportScreen} />
      <Stack.Screen name="VerifiedVendors" component={VerifiedVendorsScreen} />
      <Stack.Screen name="CommunitySafetyGuidelines" component={CommunitySafetyGuidelinesScreen} />
      <Stack.Screen name="CommunityContactRequest" component={CommunityContactRequestScreen} />
    </Stack.Navigator>
  );
}
