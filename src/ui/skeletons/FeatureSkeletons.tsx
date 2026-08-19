import React from "react";
import { View } from "react-native";
import { ShimmerBlock, ShimmerProvider } from "../loading/ShimmerBlock";
import { styles } from "./styles/FeatureSkeletons.styles";
export function PriorityRailSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.section} testID="priority-rail-skeleton">
        <View style={styles.rowBetween}>
          <ShimmerBlock width={140} height={20}/>
          <ShimmerBlock width={80} height={16}/>
        </View>
        <View style={[styles.row, styles.viewGapMarginTop]}>
          <ShimmerBlock width={260} height={120} borderRadius={18}/>
          <ShimmerBlock width={260} height={120} borderRadius={18}/>
        </View>
      </View>
    </ShimmerProvider>);
}
export function ResidencePulseSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.section} testID="residence-pulse-skeleton">
        <ShimmerBlock width={120} height={18}/>
        <View style={[styles.card, styles.viewMarginTopGap2]}>
          <View style={[styles.row, styles.viewGap10]}>
            <ShimmerBlock width={42} height={42} borderRadius={14}/>
            <View style={styles.viewFlexGap}>
              <ShimmerBlock width="40%" height={14}/>
              <ShimmerBlock width="60%" height={18}/>
            </View>
          </View>
          <View style={[styles.row, styles.viewFlexWrapGap]}>
            <ShimmerBlock width={100} height={36} borderRadius={12}/>
            <ShimmerBlock width={100} height={36} borderRadius={12}/>
            <ShimmerBlock width={100} height={36} borderRadius={12}/>
          </View>
        </View>
      </View>
    </ShimmerProvider>);
}
export function VisitorTimelineSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.section} testID="visitor-timeline-skeleton">
        <View style={styles.rowBetween}>
          <ShimmerBlock width={130} height={18}/>
          <ShimmerBlock width={70} height={14}/>
        </View>
        <View style={styles.viewMarginTopGap}>
          {[1, 2].map((i) => (<View key={i} style={[styles.row, styles.viewGap11]}>
              <View style={styles.viewAlignItems}>
                <ShimmerBlock width={12} height={12} borderRadius={6}/>
                <ShimmerBlock width={2} height={80} style={styles.shimmerBlockMarginVertical}/>
              </View>
              <View style={[styles.card, styles.viewFlex]}>
                <View style={[styles.row, styles.viewGap12]}>
                  <ShimmerBlock width={32} height={32} borderRadius={10}/>
                  <View style={styles.viewFlexGap2}>
                    <ShimmerBlock width="50%" height={14}/>
                    <ShimmerBlock width="30%" height={10}/>
                  </View>
                  <ShimmerBlock width={60} height={18} borderRadius={8}/>
                </View>
              </View>
            </View>))}
        </View>
      </View>
    </ShimmerProvider>);
}
export function BillSummarySkeleton() {
    return (<ShimmerProvider>
      <View style={styles.section} testID="bill-summary-skeleton">
        <ShimmerBlock width={150} height={18} style={styles.shimmerBlockMarginBottom}/>
        <View style={styles.card}>
          <View style={[styles.rowBetween, styles.viewMarginBottom]}>
            <View style={styles.viewGap}>
              <ShimmerBlock width={120} height={20}/>
              <ShimmerBlock width={80} height={12}/>
            </View>
            <ShimmerBlock width={70} height={24} borderRadius={12}/>
          </View>
          <ShimmerBlock width="100%" height={40} borderRadius={12}/>
        </View>
      </View>
    </ShimmerProvider>);
}
export function ComplaintProgressSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.section} testID="complaint-progress-skeleton">
        <ShimmerBlock width={140} height={18} style={styles.shimmerBlockMarginBottom2}/>
        <View style={styles.card}>
          <View style={[styles.rowBetween, styles.viewMarginBottom2]}>
            <ShimmerBlock width={100} height={14}/>
            <ShimmerBlock width={60} height={18} borderRadius={8}/>
          </View>
          <ShimmerBlock width="90%" height={16} style={styles.shimmerBlockMarginBottom3}/>
          <View style={[styles.rowBetween, styles.viewMarginTop]}>
            <ShimmerBlock width={80} height={12}/>
            <ShimmerBlock width={120} height={12}/>
          </View>
        </View>
      </View>
    </ShimmerProvider>);
}
export function ResidentConnectSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.section} testID="resident-connect-skeleton">
        <ShimmerBlock width={160} height={18} style={styles.shimmerBlockMarginBottom4}/>
        <View style={styles.card}>
          <View style={[styles.row, styles.viewGap13]}>
            <ShimmerBlock width={40} height={40} borderRadius={20}/>
            <View style={styles.viewFlexGap3}>
              <ShimmerBlock width="60%" height={14}/>
              <ShimmerBlock width="40%" height={12}/>
            </View>
          </View>
        </View>
      </View>
    </ShimmerProvider>);
}
export function NoticeRailSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.section} testID="notice-rail-skeleton">
        <View style={styles.rowBetween}>
          <ShimmerBlock width={120} height={18}/>
          <ShimmerBlock width={60} height={14}/>
        </View>
        <View style={[styles.row, styles.viewGapMarginTop2]}>
          <ShimmerBlock width={280} height={140} borderRadius={18}/>
          <ShimmerBlock width={280} height={140} borderRadius={18}/>
        </View>
      </View>
    </ShimmerProvider>);
}
export function DocumentReadinessSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.section} testID="document-readiness-skeleton">
        <ShimmerBlock width={150} height={18} style={styles.shimmerBlockMarginBottom5}/>
        <View style={styles.card}>
          <View style={[styles.row, styles.viewGap14]}>
            <ShimmerBlock width={36} height={36} borderRadius={8}/>
            <View style={styles.viewFlexGap4}>
              <ShimmerBlock width="70%" height={14}/>
              <ShimmerBlock width="50%" height={12}/>
            </View>
          </View>
        </View>
      </View>
    </ShimmerProvider>);
}
export function AmenityRailSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.section} testID="amenity-rail-skeleton">
        <ShimmerBlock width={130} height={18} style={styles.shimmerBlockMarginBottom6}/>
        <View style={[styles.row, styles.viewGap15]}>
          <ShimmerBlock width={180} height={150} borderRadius={16}/>
          <ShimmerBlock width={180} height={150} borderRadius={16}/>
        </View>
      </View>
    </ShimmerProvider>);
}
export function CommunityServicesSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.section} testID="community-services-skeleton">
        <ShimmerBlock width={140} height={18} style={styles.shimmerBlockMarginBottom7}/>
        <View style={[styles.row, styles.viewGapFlexWrap]}>
          {[1, 2, 3].map((i) => (<ShimmerBlock key={i} width={100} height={80} borderRadius={14}/>))}
        </View>
      </View>
    </ShimmerProvider>);
}
export function RecentActivitySkeleton() {
    return (<ShimmerProvider>
      <View style={styles.section} testID="recent-activity-skeleton">
        <ShimmerBlock width={130} height={18} style={styles.shimmerBlockMarginBottom8}/>
        <View style={styles.viewGap2}>
          {[1, 2].map((i) => (<View key={i} style={[styles.row, styles.viewGap16]}>
              <ShimmerBlock width={32} height={32} borderRadius={16}/>
              <View style={styles.viewFlexGap5}>
                <ShimmerBlock width="80%" height={12}/>
                <ShimmerBlock width="40%" height={10}/>
              </View>
            </View>))}
        </View>
      </View>
    </ShimmerProvider>);
}
export function ResidentDashboardSkeleton() {
    return (<ScrollViewSkeleton>
      <View style={styles.viewPaddingVertical}>
        <PriorityRailSkeleton />
        <ResidencePulseSkeleton />
        <VisitorTimelineSkeleton />
        <BillSummarySkeleton />
        <ComplaintProgressSkeleton />
        <NoticeRailSkeleton />
      </View>
    </ScrollViewSkeleton>);
}
export function ChatListSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="chat-list-skeleton">
        {[1, 2, 3, 4].map((i) => (<View key={i} style={[styles.row, styles.viewGapPaddingVerticalBorderBottomWidthBorderBottomColor]}>
            <ShimmerBlock width={48} height={48} borderRadius={24}/>
            <View style={styles.viewFlexGap6}>
              <View style={styles.rowBetween}>
                <ShimmerBlock width="40%" height={16}/>
                <ShimmerBlock width="15%" height={10}/>
              </View>
              <ShimmerBlock width="70%" height={12}/>
            </View>
          </View>))}
      </View>
    </ShimmerProvider>);
}
export function ChatConversationSkeleton() {
    return (<ShimmerProvider>
      <View style={[styles.listContainer, styles.viewPaddingBottom]} testID="chat-conversation-skeleton">
        {[1, 2, 3].map((i) => (<View key={i} style={styles.viewGapMarginVertical}>
            <View style={[styles.row, styles.viewAlignSelfGapMaxWidth]}>
              <ShimmerBlock width={28} height={28} borderRadius={14}/>
              <ShimmerBlock width={200} height={60} borderRadius={12}/>
            </View>
            <View style={styles.viewAlignSelfMaxWidth}>
              <ShimmerBlock width={160} height={44} borderRadius={12}/>
            </View>
          </View>))}
      </View>
    </ShimmerProvider>);
}
export function FamilyFormSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.formContainer} testID="family-form-skeleton">
        <View style={styles.viewGap3}>
          <ShimmerBlock width={80} height={14}/>
          <ShimmerBlock width="100%" height={48} borderRadius={12}/>
        </View>
        <View style={styles.viewGap4}>
          <ShimmerBlock width={60} height={14}/>
          <ShimmerBlock width="100%" height={48} borderRadius={12}/>
        </View>
        <View style={styles.viewGap5}>
          <ShimmerBlock width={100} height={14}/>
          <ShimmerBlock width="100%" height={48} borderRadius={12}/>
        </View>
        <ShimmerBlock width="100%" height={48} borderRadius={12} style={styles.shimmerBlockMarginTop}/>
      </View>
    </ShimmerProvider>);
}
export function ContactRequestFormSkeleton() {
    return <FamilyFormSkeleton />;
}
export function TenantManagementSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="tenant-management-skeleton">
        <ShimmerBlock width={180} height={22} style={styles.shimmerBlockMarginBottom9}/>
        {[1, 2].map((i) => (<View key={i} style={[styles.card, styles.viewMarginBottom3]}>
            <View style={[styles.rowBetween, styles.viewMarginBottom4]}>
              <ShimmerBlock width="50%" height={16}/>
              <ShimmerBlock width={60} height={18} borderRadius={8}/>
            </View>
            <ShimmerBlock width="35%" height={12} style={styles.shimmerBlockMarginBottom10}/>
            <View style={styles.rowBetween}>
              <ShimmerBlock width={80} height={32} borderRadius={8}/>
              <ShimmerBlock width={80} height={32} borderRadius={8}/>
            </View>
          </View>))}
      </View>
    </ShimmerProvider>);
}
export function TenantStatusSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="tenant-status-skeleton">
        <View style={[styles.card, styles.viewGap17]}>
          <ShimmerBlock width="40%" height={18}/>
          <ShimmerBlock width="80%" height={14}/>
          <ShimmerBlock width="100%" height={10}/>
          <ShimmerBlock width="100%" height={44} borderRadius={12}/>
        </View>
      </View>
    </ShimmerProvider>);
}
export function BillsListSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="bills-list-skeleton">
        {[1, 2, 3].map((i) => (<View key={i} style={[styles.card, styles.viewMarginBottom5]}>
            <View style={[styles.rowBetween, styles.viewMarginBottom6]}>
              <ShimmerBlock width="60%" height={18}/>
              <ShimmerBlock width={80} height={22} borderRadius={12}/>
            </View>
            <ShimmerBlock width="30%" height={12} style={styles.shimmerBlockMarginBottom11}/>
            <View style={[styles.rowBetween, styles.viewBorderTopWidthBorderTopColorPaddingTop]}>
              <ShimmerBlock width={90} height={14}/>
              <ShimmerBlock width={100} height={14}/>
            </View>
          </View>))}
      </View>
    </ShimmerProvider>);
}
export function BillDetailsSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="bill-details-skeleton">
        <View style={[styles.card, styles.viewGap18]}>
          <View style={styles.viewGap6}>
            <ShimmerBlock width="30%" height={14}/>
            <ShimmerBlock width="60%" height={24}/>
          </View>
          <View style={styles.viewHeightBackgroundColor}/>
          {[1, 2, 3].map((i) => (<View key={i} style={styles.rowBetween}>
              <ShimmerBlock width="40%" height={14}/>
              <ShimmerBlock width="25%" height={14}/>
            </View>))}
          <ShimmerBlock width="100%" height={44} borderRadius={12} style={styles.shimmerBlockMarginTop2}/>
        </View>
      </View>
    </ShimmerProvider>);
}
export function PaymentCheckoutSkeleton() {
    return <BillDetailsSkeleton />;
}
export function ComplaintsListSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="complaints-list-skeleton">
        {[1, 2, 3].map((i) => (<View key={i} style={[styles.card, styles.viewMarginBottomGap]}>
            <View style={styles.rowBetween}>
              <ShimmerBlock width={70} height={12}/>
              <ShimmerBlock width={60} height={18} borderRadius={8}/>
            </View>
            <ShimmerBlock width="80%" height={16}/>
            <ShimmerBlock width="40%" height={12}/>
          </View>))}
      </View>
    </ShimmerProvider>);
}
export function ComplaintDetailsSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="complaint-details-skeleton">
        <View style={[styles.card, styles.viewGapMarginBottom]}>
          <View style={styles.rowBetween}>
            <ShimmerBlock width="30%" height={12}/>
            <ShimmerBlock width={60} height={18} borderRadius={8}/>
          </View>
          <ShimmerBlock width="90%" height={20}/>
          <ShimmerBlock width="100%" height={40}/>
        </View>
        <ShimmerBlock width={120} height={16} style={styles.shimmerBlockMarginLeftMarginBottom}/>
        <View style={styles.viewGapPaddingLeft}>
          {[1, 2].map((i) => (<View key={i} style={[styles.row, styles.viewGap19]}>
              <ShimmerBlock width={8} height={8} borderRadius={4} style={styles.shimmerBlockMarginTop3}/>
              <View style={styles.viewFlexGap7}>
                <ShimmerBlock width="40%" height={12}/>
                <ShimmerBlock width="70%" height={10}/>
              </View>
            </View>))}
        </View>
      </View>
    </ShimmerProvider>);
}
export function NoticesListSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="notices-list-skeleton">
        {[1, 2, 3].map((i) => (<View key={i} style={[styles.card, styles.viewMarginBottomGap2]}>
            <View style={styles.rowBetween}>
              <ShimmerBlock width={80} height={18} borderRadius={8}/>
              <ShimmerBlock width={60} height={12}/>
            </View>
            <ShimmerBlock width="85%" height={18}/>
            <ShimmerBlock width="100%" height={32}/>
          </View>))}
      </View>
    </ShimmerProvider>);
}
export function NoticeDetailsSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="notice-details-skeleton">
        <View style={styles.viewGap7}>
          <View style={styles.rowBetween}>
            <ShimmerBlock width={80} height={20} borderRadius={8}/>
            <ShimmerBlock width={100} height={12}/>
          </View>
          <ShimmerBlock width="100%" height={26}/>
          <View style={styles.viewHeightBackgroundColorMarginVertical}/>
          <ShimmerBlock width="100%" height={12}/>
          <ShimmerBlock width="95%" height={12}/>
          <ShimmerBlock width="90%" height={12}/>
          <ShimmerBlock width="100%" height={12} style={styles.shimmerBlockMarginTop4}/>
          <ShimmerBlock width="80%" height={12}/>
        </View>
      </View>
    </ShimmerProvider>);
}
export function DocumentVaultSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="document-vault-skeleton">
        <View style={[styles.row, styles.viewGapFlexWrapMarginBottom]}>
          <ShimmerBlock width={100} height={40} borderRadius={20}/>
          <ShimmerBlock width={100} height={40} borderRadius={20}/>
        </View>
        {[1, 2, 3].map((i) => (<View key={i} style={[styles.card, styles.viewMarginBottom7]}>
            <View style={[styles.row, styles.viewGap20]}>
              <ShimmerBlock width={36} height={36} borderRadius={8}/>
              <View style={styles.viewFlexGap8}>
                <ShimmerBlock width="70%" height={14}/>
                <ShimmerBlock width="40%" height={10}/>
              </View>
              <ShimmerBlock width={16} height={16}/>
            </View>
          </View>))}
      </View>
    </ShimmerProvider>);
}
export function DocumentDetailsSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="document-details-skeleton">
        <View style={[styles.card, styles.viewGap21]}>
          <View style={[styles.row, styles.viewGap22]}>
            <ShimmerBlock width={40} height={40} borderRadius={8}/>
            <View style={styles.viewFlexGap9}>
              <ShimmerBlock width="80%" height={16}/>
              <ShimmerBlock width="40%" height={12}/>
            </View>
          </View>
          <ShimmerBlock width="100%" height={240} borderRadius={12}/>
          <View style={styles.rowBetween}>
            <ShimmerBlock width={120} height={36} borderRadius={8}/>
            <ShimmerBlock width={120} height={36} borderRadius={8}/>
          </View>
        </View>
      </View>
    </ShimmerProvider>);
}
export function NocListSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="noc-list-skeleton">
        {[1, 2, 3].map((i) => (<View key={i} style={[styles.card, styles.viewMarginBottomGap3]}>
            <View style={styles.rowBetween}>
              <ShimmerBlock width="60%" height={16}/>
              <ShimmerBlock width={80} height={18} borderRadius={8}/>
            </View>
            <ShimmerBlock width="40%" height={12}/>
          </View>))}
      </View>
    </ShimmerProvider>);
}
export function NocDetailsSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="noc-details-skeleton">
        <View style={[styles.card, styles.viewGap23]}>
          <ShimmerBlock width="30%" height={12}/>
          <ShimmerBlock width="70%" height={18}/>
          <ShimmerBlock width="50%" height={12}/>
          <ShimmerBlock width="100%" height={1}/>
          <ShimmerBlock width="100%" height={40}/>
        </View>
      </View>
    </ShimmerProvider>);
}
export function FacilityListSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="facility-list-skeleton">
        {[1, 2].map((i) => (<View key={i} style={[styles.card, styles.viewMarginBottomGap4]}>
            <ShimmerBlock width="100%" height={160} borderRadius={14}/>
            <View style={styles.rowBetween}>
              <ShimmerBlock width="60%" height={18}/>
              <ShimmerBlock width={80} height={14}/>
            </View>
            <ShimmerBlock width="40%" height={12}/>
          </View>))}
      </View>
    </ShimmerProvider>);
}
export function FacilityDetailsSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="facility-details-skeleton">
        <ShimmerBlock width="100%" height={200} borderRadius={16} style={styles.shimmerBlockMarginBottom12}/>
        <View style={styles.viewGap8}>
          <ShimmerBlock width="50%" height={24}/>
          <ShimmerBlock width="80%" height={14}/>
          <ShimmerBlock width="100%" height={1}/>
          <ShimmerBlock width="100%" height={44} borderRadius={12}/>
        </View>
      </View>
    </ShimmerProvider>);
}
export function BookingCalendarSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="booking-calendar-skeleton">
        <View style={[styles.card, styles.viewGap24]}>
          <ShimmerBlock width="60%" height={18}/>
          <View style={[styles.row, styles.viewGapJustifyContent]}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (<ShimmerBlock key={i} width={34} height={44} borderRadius={8}/>))}
          </View>
          <ShimmerBlock width="100%" height={44} borderRadius={12}/>
        </View>
      </View>
    </ShimmerProvider>);
}
export function MarketplaceListSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="marketplace-list-skeleton">
        <View style={[styles.row, styles.viewGapFlexWrap2]}>
          {[1, 2, 3, 4].map((i) => (<View key={i} style={[styles.card, styles.viewWidthGap]}>
              <ShimmerBlock width="100%" height={110} borderRadius={10}/>
              <ShimmerBlock width="90%" height={14}/>
              <ShimmerBlock width="50%" height={12}/>
            </View>))}
        </View>
      </View>
    </ShimmerProvider>);
}
export function MarketplaceDetailsSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="marketplace-details-skeleton">
        <ShimmerBlock width="100%" height={240} borderRadius={16} style={styles.shimmerBlockMarginBottom13}/>
        <View style={styles.viewGap9}>
          <View style={styles.rowBetween}>
            <ShimmerBlock width="70%" height={22}/>
            <ShimmerBlock width="25%" height={22}/>
          </View>
          <ShimmerBlock width="40%" height={14}/>
          <ShimmerBlock width="100%" height={60}/>
          <ShimmerBlock width="100%" height={48} borderRadius={12}/>
        </View>
      </View>
    </ShimmerProvider>);
}
export function VendorListSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="vendor-list-skeleton">
        {[1, 2, 3].map((i) => (<View key={i} style={[styles.card, styles.viewMarginBottom8]}>
            <View style={[styles.row, styles.viewGap25]}>
              <ShimmerBlock width={48} height={48} borderRadius={24}/>
              <View style={styles.viewFlexGap10}>
                <ShimmerBlock width="60%" height={16}/>
                <ShimmerBlock width="40%" height={12}/>
              </View>
              <ShimmerBlock width={50} height={18} borderRadius={8}/>
            </View>
          </View>))}
      </View>
    </ShimmerProvider>);
}
export function ResidentDirectorySkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="resident-directory-skeleton">
        {[1, 2, 3, 4].map((i) => (<View key={i} style={[styles.row, styles.viewGapPaddingVerticalBorderBottomWidthBorderBottomColor2]}>
            <ShimmerBlock width={40} height={40} borderRadius={20}/>
            <View style={styles.viewFlexGap11}>
              <ShimmerBlock width="50%" height={14}/>
              <ShimmerBlock width="30%" height={12}/>
            </View>
          </View>))}
      </View>
    </ShimmerProvider>);
}
export function SettingsSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="settings-skeleton">
        <View style={[styles.card, styles.viewGap26]}>
          {[1, 2, 3].map((i) => (<View key={i} style={[styles.row, styles.viewGap27]}>
              <ShimmerBlock width={20} height={20} borderRadius={4}/>
              <ShimmerBlock width="70%" height={14}/>
            </View>))}
        </View>
      </View>
    </ShimmerProvider>);
}
export function ProfileSkeleton() {
    return (<ShimmerProvider>
      <View style={styles.listContainer} testID="profile-skeleton">
        <View style={styles.viewAlignItemsGapMarginBottom}>
          <ShimmerBlock width={80} height={80} borderRadius={40}/>
          <ShimmerBlock width={140} height={18}/>
          <ShimmerBlock width={100} height={12}/>
        </View>
        <FamilyFormSkeleton />
      </View>
    </ShimmerProvider>);
}
function ScrollViewSkeleton({ children }: {
    children: React.ReactNode;
}) {
    return <View>{children}</View>;
}

