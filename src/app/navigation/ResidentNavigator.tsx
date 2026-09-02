import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMessages } from "../../shared/constants/useMessages";
import { ResidentHomeScreen } from "../../modules/resident/dashboard/screens/ResidentHomeScreen";
import { ResidentActivityScreen } from "../../modules/resident/dashboard/screens/ResidentActivityScreen";
import { ResidentServicesScreen } from "../../modules/resident/services/ResidentServicesScreen";
import { VisitorListScreen } from "../../modules/resident/visitors/screens/VisitorListScreen";
import { VisitorDetailScreen } from "../../modules/resident/visitors/screens/VisitorDetailScreen";
import { CreateVisitorPassScreen } from "../../modules/resident/visitors/screens/CreateVisitorPassScreen";
import { ComplaintListScreen } from "../../modules/resident/complaints/screens/ComplaintListScreen";
import { ComplaintDetailScreen } from "../../modules/resident/complaints/screens/ComplaintDetailScreen";
import { CreateComplaintScreen } from "../../modules/resident/complaints/screens/CreateComplaintScreen";
import { ComplaintReopenScreen } from "../../modules/resident/complaints/screens/ComplaintReopenScreen";
import { ComplaintFeedbackScreen } from "../../modules/resident/complaints/screens/ComplaintFeedbackScreen";
import { BillListScreen } from "../../modules/resident/billing/screens/BillListScreen";
import { BillDetailScreen } from "../../modules/resident/billing/screens/BillDetailScreen";
import { MockPaymentConfirmationScreen } from "../../modules/resident/billing/screens/MockPaymentConfirmationScreen";
import { AdvancePaymentScreen } from "../../modules/resident/billing/screens/AdvancePaymentScreen";
import { PaymentSuccessScreen } from "../../modules/resident/billing/screens/PaymentSuccessScreen";
import { FlatLedgerScreen } from "../../modules/resident/billing/screens/FlatLedgerScreen";
import { NoticeListScreen } from "../../modules/resident/notices/screens/NoticeListScreen";
import { NoticeDetailScreen } from "../../modules/resident/notices/screens/NoticeDetailScreen";
import { EmergencySosScreen } from "../../modules/resident/emergency/screens/EmergencySosScreen";
import { HelpdeskScreen } from "../../modules/helpdesk/screens/HelpdeskScreen";
import { DocumentVaultHomeScreen } from "../../modules/resident/documents/screens/DocumentVaultHomeScreen";
import { MyDocumentsScreen } from "../../modules/resident/documents/screens/MyDocumentsScreen";
import { SocietyDocumentsScreen } from "../../modules/resident/documents/screens/SocietyDocumentsScreen";
import { DocumentDetailScreen } from "../../modules/resident/documents/screens/DocumentDetailScreen";
import { UploadDocumentScreen } from "../../modules/resident/documents/screens/UploadDocumentScreen";
import { DocumentAccessLogScreen } from "../../modules/resident/documents/screens/DocumentAccessLogScreen";
import { NocRequestListScreen } from "../../modules/resident/noc/screens/NocRequestListScreen";
import { CreateNocRequestScreen } from "../../modules/resident/noc/screens/CreateNocRequestScreen";
import { NocRequestDetailScreen } from "../../modules/resident/noc/screens/NocRequestDetailScreen";
import { MoveOutRequestScreen } from "../../modules/resident/noc/screens/MoveOutRequestScreen";
import { MoveOutClearanceChecklistScreen } from "../../modules/resident/noc/screens/MoveOutClearanceChecklistScreen";
import { NocCertificateScreen } from "../../modules/resident/noc/screens/NocCertificateScreen";
import { OwnerTenantOverviewScreen } from "../../modules/resident/profile/screens/OwnerTenantOverviewScreen";
import { CurrentOwnerProfileScreen } from "../../modules/resident/profile/screens/CurrentOwnerProfileScreen";
import { CurrentTenantProfileScreen } from "../../modules/resident/profile/screens/CurrentTenantProfileScreen";
import { AddFamilyMemberScreen, AddTenantAccessPermissionsScreen, AddTenantAgreementScreen, AddTenantDocumentsScreen, AddTenantPersonalInfoScreen, AddTenantReviewScreen, AddTenantStartScreen, EditFamilyMemberScreen, FamilyAccessPermissionsScreen, FamilyMemberDetailScreen, FamilyMemberListScreen, HouseholdOverviewScreen, TenantDetailScreen, TenantManagementScreen, TenantOnboardingStatusScreen, TenantOnboardingSuccessScreen, TenantRestrictedStateScreen } from "../../modules/resident/household";
import { UnitVehiclesScreen } from "../../modules/resident/profile/screens/UnitVehiclesScreen";
import { CurrentDocumentsSummaryScreen } from "../../modules/resident/profile/screens/CurrentDocumentsSummaryScreen";
import { OwnerHistoryScreen } from "../../modules/resident/profile/screens/OwnerHistoryScreen";
import { TenantHistoryScreen } from "../../modules/resident/profile/screens/TenantHistoryScreen";
import { OccupancyTimelineScreen } from "../../modules/resident/profile/screens/OccupancyTimelineScreen";
import { PreviousResidentDetailScreen } from "../../modules/resident/profile/screens/PreviousResidentDetailScreen";
import { PreviousResidentDocumentsScreen } from "../../modules/resident/profile/screens/PreviousResidentDocumentsScreen";
import { MoveInRequestScreen } from "../../modules/resident/profile/screens/MoveInRequestScreen";
import { UnitAccessStatusScreen } from "../../modules/resident/profile/screens/UnitAccessStatusScreen";
import { OwnershipTenancySummaryScreen } from "../../modules/resident/profile/screens/OwnershipTenancySummaryScreen";
import { ResidentConnectStack } from "./ResidentConnectStack";
import { ParkingStack } from "./ParkingStack";
import { FacilityStack } from "./FacilityStack";
import { GovernanceStack } from "./GovernanceStack";
import { EmergencySafetyStack } from "./EmergencySafetyStack";
import { SosResponsePlanStack as SosResponsePlanStackComponent } from "../../modules/resident/emergency/navigation/SosResponsePlanStack";
import { InterFlatStack } from "./InterFlatStack";
import { CommunityStack } from "./CommunityStack";
import { ProfileNavigator } from "./ProfileNavigator";
import { DomesticHelpStack } from "./DomesticHelpStack";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { ResidentChatHomeScreen } from "../../modules/resident/chat/screens/ResidentChatHomeScreen";
import { ResidentDirectorySelectionScreen } from "../../modules/resident/residentConnect/screens/ResidentDirectorySelectionScreen";
import { NewResidentContactRequestScreen } from "../../modules/resident/residentConnect/screens/NewResidentContactRequestScreen";
import { ResidentContactRequestsScreen } from "../../modules/resident/residentConnect/screens/ResidentContactRequestsScreen";
import { ResidentDirectConversationScreen } from "../../modules/resident/residentConnect/screens/ResidentDirectConversationScreen";
import { useResidentContactRequests, useResidentDirectConversations } from "../../modules/resident/residentConnect/hooks/useResidentContactData";
import { ResidentConversationScreen } from "../../modules/resident/chat/screens/ResidentConversationScreen";
import { useResidentChatConversations } from "../../modules/resident/chat/hooks/useResidentChatConversations";
import { ResidentCapabilityGuard, withResidentCapability } from "../../features/residentCapabilities/ResidentCapabilityGuard";
import { ResidentTabBar } from "../../modules/resident/navigation/ResidentTabBar";
import { FamilyPortabilityScreen } from "../../modules/resident/lifecycle/screens/FamilyPortabilityScreen";
import { RentalDeclarationScreen } from "../../modules/resident/lifecycle/screens/RentalDeclarationScreen";
import { ShortStayManagementScreen } from "../../modules/resident/lifecycle/screens/ShortStayManagementScreen";
import type { RootTabParamList, HomeStackParamList, VisitorStackParamList, ComplaintStackParamList, BillStackParamList, ChatStackParamList } from "./navigation.types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles } from "./styles/ResidentNavigator.styles";
import { residentTabIcons } from "../../modules/resident/navigation/residentPrimaryNavigation";
import { SocietyExperienceProvider } from "../../modules/resident/experience/SocietyExperienceContext";
import { KeyboardExperienceProvider } from "../../modules/resident/experience/KeyboardExperienceContext";
const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const VisitorStack = createNativeStackNavigator<VisitorStackParamList>();
const ComplaintStack = createNativeStackNavigator<ComplaintStackParamList>();
const BillStack = createNativeStackNavigator<BillStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const stackScreenOptions = {
    headerShown: false,
    animation: 'fade' as const,
    animationDuration: 220
};

function CreateVisitorFromHomeAdapter(props: NativeStackScreenProps<HomeStackParamList, 'CreateVisitorFromHome'>) {
    return (<ResidentCapabilityGuard capabilityId="resident.visitors">
      <CreateVisitorPassScreen navigation={props.navigation as never} route={props.route as never}/>
    </ResidentCapabilityGuard>);
}
function FamilyMembersCompatibilityAdapter(props: NativeStackScreenProps<HomeStackParamList, 'FamilyMembers'>) {
    return (<ResidentCapabilityGuard capabilityId="resident.household">
      <FamilyMemberListScreen navigation={props.navigation as never} route={props.route as never}/>
    </ResidentCapabilityGuard>);
}
const HouseholdOverviewCapabilityScreen = withResidentCapability(HouseholdOverviewScreen, 'resident.household');
const FamilyMemberListCapabilityScreen = withResidentCapability(FamilyMemberListScreen, 'resident.household');
const AddFamilyMemberCapabilityScreen = withResidentCapability(AddFamilyMemberScreen, 'resident.household');
const EditFamilyMemberCapabilityScreen = withResidentCapability(EditFamilyMemberScreen, 'resident.household');
const FamilyMemberDetailCapabilityScreen = withResidentCapability(FamilyMemberDetailScreen, 'resident.household');
const FamilyAccessPermissionsCapabilityScreen = withResidentCapability(FamilyAccessPermissionsScreen, 'resident.household');
const FamilyPortabilityCapabilityScreen = withResidentCapability(FamilyPortabilityScreen, 'resident.familyPortability');
const TenantManagementCapabilityScreen = withResidentCapability(TenantManagementScreen, 'resident.tenantLifecycle');
const RentalDeclarationCapabilityScreen = withResidentCapability(RentalDeclarationScreen, 'resident.rentalDeclaration');
const ShortStayManagementCapabilityScreen = withResidentCapability(ShortStayManagementScreen, 'resident.shortStay');
const AddTenantStartCapabilityScreen = withResidentCapability(AddTenantStartScreen, 'resident.tenantLifecycle');
const AddTenantPersonalInfoCapabilityScreen = withResidentCapability(AddTenantPersonalInfoScreen, 'resident.tenantLifecycle');
const AddTenantAgreementCapabilityScreen = withResidentCapability(AddTenantAgreementScreen, 'resident.tenantLifecycle');
const AddTenantDocumentsCapabilityScreen = withResidentCapability(AddTenantDocumentsScreen, 'resident.tenantLifecycle');
const AddTenantAccessPermissionsCapabilityScreen = withResidentCapability(AddTenantAccessPermissionsScreen, 'resident.tenantLifecycle');
const AddTenantReviewCapabilityScreen = withResidentCapability(AddTenantReviewScreen, 'resident.tenantLifecycle');
const TenantOnboardingSuccessCapabilityScreen = withResidentCapability(TenantOnboardingSuccessScreen, 'resident.tenantLifecycle');
const TenantOnboardingStatusCapabilityScreen = withResidentCapability(TenantOnboardingStatusScreen, 'resident.tenantLifecycle');
const TenantDetailCapabilityScreen = withResidentCapability(TenantDetailScreen, 'resident.tenantLifecycle');
const TenantRestrictedStateCapabilityScreen = withResidentCapability(TenantRestrictedStateScreen, 'resident.tenantLifecycle');
const CreateComplaintFromHomeCapabilityScreen = withResidentCapability(CreateComplaintScreen, 'resident.complaints');
const ComplaintDetailFromHomeCapabilityScreen = withResidentCapability(ComplaintDetailScreen, 'resident.complaints');
const ComplaintReopenCapabilityScreen = withResidentCapability(ComplaintReopenScreen, 'resident.complaints');
const ComplaintFeedbackCapabilityScreen = withResidentCapability(ComplaintFeedbackScreen, 'resident.complaints');
const VisitorDetailFromHomeCapabilityScreen = withResidentCapability(VisitorDetailScreen, 'resident.visitors');
const NoticeListFromHomeCapabilityScreen = withResidentCapability(NoticeListScreen, 'resident.notices');
const NoticeDetailFromHomeCapabilityScreen = withResidentCapability(NoticeDetailScreen, 'resident.notices');
const EmergencySosCapabilityScreen = withResidentCapability(EmergencySosScreen, 'resident.emergency');
const HelpdeskCapabilityScreen = withResidentCapability(HelpdeskScreen, 'resident.complaints');
const DocumentVaultCapabilityScreen = withResidentCapability(DocumentVaultHomeScreen, 'resident.documents');
const MyDocumentsCapabilityScreen = withResidentCapability(MyDocumentsScreen, 'resident.documents');
const SocietyDocumentsCapabilityScreen = withResidentCapability(SocietyDocumentsScreen, 'resident.documents');
const DocumentDetailCapabilityScreen = withResidentCapability(DocumentDetailScreen, 'resident.documents');
const UploadDocumentCapabilityScreen = withResidentCapability(UploadDocumentScreen, 'resident.documents');
const DocumentAccessLogCapabilityScreen = withResidentCapability(DocumentAccessLogScreen, 'resident.documents');
const NocRequestListCapabilityScreen = withResidentCapability(NocRequestListScreen, 'resident.nocAndMoveOut');
const CreateNocRequestCapabilityScreen = withResidentCapability(CreateNocRequestScreen, 'resident.nocAndMoveOut');
const NocRequestDetailCapabilityScreen = withResidentCapability(NocRequestDetailScreen, 'resident.nocAndMoveOut');
const MoveOutRequestCapabilityScreen = withResidentCapability(MoveOutRequestScreen, 'resident.nocAndMoveOut');
const MoveOutClearanceCapabilityScreen = withResidentCapability(MoveOutClearanceChecklistScreen, 'resident.nocAndMoveOut');
const NocCertificateCapabilityScreen = withResidentCapability(NocCertificateScreen, 'resident.nocAndMoveOut');
const OwnerTenantOverviewCapabilityScreen = withResidentCapability(OwnerTenantOverviewScreen, 'resident.tenantLifecycle');
const CurrentOwnerProfileCapabilityScreen = withResidentCapability(CurrentOwnerProfileScreen, 'resident.tenantLifecycle');
const CurrentTenantProfileCapabilityScreen = withResidentCapability(CurrentTenantProfileScreen, 'resident.tenantLifecycle');
const UnitVehiclesCapabilityScreen = withResidentCapability(UnitVehiclesScreen, 'resident.parking');
const CurrentDocumentsSummaryCapabilityScreen = withResidentCapability(CurrentDocumentsSummaryScreen, 'resident.documents');
const OwnerHistoryCapabilityScreen = withResidentCapability(OwnerHistoryScreen, 'resident.tenantLifecycle');
const TenantHistoryCapabilityScreen = withResidentCapability(TenantHistoryScreen, 'resident.tenantLifecycle');
const OccupancyTimelineCapabilityScreen = withResidentCapability(OccupancyTimelineScreen, 'resident.tenantLifecycle');
const PreviousResidentDetailCapabilityScreen = withResidentCapability(PreviousResidentDetailScreen, 'resident.tenantLifecycle');
const PreviousResidentDocumentsCapabilityScreen = withResidentCapability(PreviousResidentDocumentsScreen, 'resident.documents');
const MoveInRequestCapabilityScreen = withResidentCapability(MoveInRequestScreen, 'resident.tenantLifecycle');
const UnitAccessStatusCapabilityScreen = withResidentCapability(UnitAccessStatusScreen, 'resident.tenantLifecycle');
const OwnershipTenancySummaryCapabilityScreen = withResidentCapability(OwnershipTenancySummaryScreen, 'resident.tenantLifecycle');
const ResidentConnectCapabilityStack = withResidentCapability(ResidentConnectStack, 'resident.residentConnect');
const ParkingCapabilityStack = withResidentCapability(ParkingStack, 'resident.parking');
const FacilityCapabilityStack = withResidentCapability(FacilityStack, 'resident.facilities');
const GovernanceCapabilityStack = withResidentCapability(GovernanceStack, 'resident.governance');
const EmergencySafetyCapabilityStack = withResidentCapability(EmergencySafetyStack, 'resident.emergency');
const SosResponsePlanCapabilityStack = withResidentCapability(SosResponsePlanStackComponent, 'resident.emergency');
const InterFlatCapabilityStack = withResidentCapability(InterFlatStack, 'resident.interFlatIssues');
const CommunityCapabilityStack = withResidentCapability(CommunityStack, 'resident.community');
const ProfileCapabilityStack = withResidentCapability(ProfileNavigator, 'resident.settings');
const DomesticHelpCapabilityStack = withResidentCapability(DomesticHelpStack, 'resident.domesticHelp');
function HomeStackNavigator() {
    return (<HomeStack.Navigator screenOptions={stackScreenOptions}>
      <HomeStack.Screen name="ResidentHome" component={ResidentHomeScreen}/>
      <HomeStack.Screen name="CreateVisitorFromHome" component={CreateVisitorFromHomeAdapter}/>
      <HomeStack.Screen name="CreateComplaintFromHome" component={CreateComplaintFromHomeCapabilityScreen}/>
      <HomeStack.Screen name="ComplaintDetailFromHome" component={ComplaintDetailFromHomeCapabilityScreen}/>
      <HomeStack.Screen name="ComplaintReopen" component={ComplaintReopenCapabilityScreen}/>
      <HomeStack.Screen name="ComplaintFeedback" component={ComplaintFeedbackCapabilityScreen}/>
      <HomeStack.Screen name="VisitorDetailFromHome" component={VisitorDetailFromHomeCapabilityScreen}/>
      <HomeStack.Screen name="NoticeListFromHome" component={NoticeListFromHomeCapabilityScreen}/>
      <HomeStack.Screen name="NoticeDetailFromHome" component={NoticeDetailFromHomeCapabilityScreen}/>
      <HomeStack.Screen name="EmergencySos" component={EmergencySosCapabilityScreen}/>
      <HomeStack.Screen name="Helpdesk" component={HelpdeskCapabilityScreen}/>
      <HomeStack.Screen name="DocumentVaultHome" component={DocumentVaultCapabilityScreen}/>
      <HomeStack.Screen name="MyDocuments" component={MyDocumentsCapabilityScreen}/>
      <HomeStack.Screen name="SocietyDocuments" component={SocietyDocumentsCapabilityScreen}/>
      <HomeStack.Screen name="DocumentDetail" component={DocumentDetailCapabilityScreen}/>
      <HomeStack.Screen name="UploadDocument" component={UploadDocumentCapabilityScreen}/>
      <HomeStack.Screen name="DocumentAccessLog" component={DocumentAccessLogCapabilityScreen}/>
      <HomeStack.Screen name="NocRequestList" component={NocRequestListCapabilityScreen}/>
      <HomeStack.Screen name="CreateNocRequest" component={CreateNocRequestCapabilityScreen}/>
      <HomeStack.Screen name="NocRequestDetail" component={NocRequestDetailCapabilityScreen}/>
      <HomeStack.Screen name="MoveOutRequest" component={MoveOutRequestCapabilityScreen}/>
      <HomeStack.Screen name="MoveOutClearanceChecklist" component={MoveOutClearanceCapabilityScreen}/>
      <HomeStack.Screen name="NocCertificate" component={NocCertificateCapabilityScreen}/>
      <HomeStack.Screen name="OwnerTenantOverview" component={OwnerTenantOverviewCapabilityScreen}/>
      <HomeStack.Screen name="CurrentOwnerProfile" component={CurrentOwnerProfileCapabilityScreen}/>
      <HomeStack.Screen name="CurrentTenantProfile" component={CurrentTenantProfileCapabilityScreen}/>
      <HomeStack.Screen name="HouseholdOverview" component={HouseholdOverviewCapabilityScreen}/>
      <HomeStack.Screen name="FamilyMembers" component={FamilyMembersCompatibilityAdapter}/>
      <HomeStack.Screen name="FamilyMemberList" component={FamilyMemberListCapabilityScreen}/>
      <HomeStack.Screen name="AddFamilyMember" component={AddFamilyMemberCapabilityScreen}/>
      <HomeStack.Screen name="EditFamilyMember" component={EditFamilyMemberCapabilityScreen}/>
      <HomeStack.Screen name="FamilyMemberDetail" component={FamilyMemberDetailCapabilityScreen}/>
      <HomeStack.Screen name="FamilyAccessPermissions" component={FamilyAccessPermissionsCapabilityScreen}/>
      <HomeStack.Screen name="FamilyPortability" component={FamilyPortabilityCapabilityScreen}/>
      <HomeStack.Screen name="TenantManagement" component={TenantManagementCapabilityScreen}/>
      <HomeStack.Screen name="RentalDeclaration" component={RentalDeclarationCapabilityScreen}/>
      <HomeStack.Screen name="ShortStayManagement" component={ShortStayManagementCapabilityScreen}/>
      <HomeStack.Screen name="AddTenantStart" component={AddTenantStartCapabilityScreen}/>
      <HomeStack.Screen name="AddTenantPersonalInfo" component={AddTenantPersonalInfoCapabilityScreen}/>
      <HomeStack.Screen name="AddTenantAgreement" component={AddTenantAgreementCapabilityScreen}/>
      <HomeStack.Screen name="AddTenantDocuments" component={AddTenantDocumentsCapabilityScreen}/>
      <HomeStack.Screen name="AddTenantAccessPermissions" component={AddTenantAccessPermissionsCapabilityScreen}/>
      <HomeStack.Screen name="AddTenantReview" component={AddTenantReviewCapabilityScreen}/>
      <HomeStack.Screen name="TenantOnboardingSuccess" component={TenantOnboardingSuccessCapabilityScreen}/>
      <HomeStack.Screen name="TenantOnboardingStatus" component={TenantOnboardingStatusCapabilityScreen}/>
      <HomeStack.Screen name="TenantDetail" component={TenantDetailCapabilityScreen}/>
      <HomeStack.Screen name="TenantRestrictedState" component={TenantRestrictedStateCapabilityScreen}/>
      <HomeStack.Screen name="UnitVehicles" component={UnitVehiclesCapabilityScreen}/>
      <HomeStack.Screen name="CurrentDocumentsSummary" component={CurrentDocumentsSummaryCapabilityScreen}/>
      <HomeStack.Screen name="OwnerHistory" component={OwnerHistoryCapabilityScreen}/>
      <HomeStack.Screen name="TenantHistory" component={TenantHistoryCapabilityScreen}/>
      <HomeStack.Screen name="OccupancyTimeline" component={OccupancyTimelineCapabilityScreen}/>
      <HomeStack.Screen name="PreviousResidentDetail" component={PreviousResidentDetailCapabilityScreen}/>
      <HomeStack.Screen name="PreviousResidentDocuments" component={PreviousResidentDocumentsCapabilityScreen}/>
      <HomeStack.Screen name="MoveInRequest" component={MoveInRequestCapabilityScreen}/>
      <HomeStack.Screen name="UnitAccessStatus" component={UnitAccessStatusCapabilityScreen}/>
      <HomeStack.Screen name="OwnershipTenancySummary" component={OwnershipTenancySummaryCapabilityScreen}/>
      <HomeStack.Screen name="ResidentConnectStack" component={ResidentConnectCapabilityStack}/>
      <HomeStack.Screen name="ParkingStack" component={ParkingCapabilityStack}/>
      <HomeStack.Screen name="FacilityStack" component={FacilityCapabilityStack}/>
      <HomeStack.Screen name="GovernanceStack" component={GovernanceCapabilityStack}/>
      <HomeStack.Screen name="EmergencySafetyStack" component={EmergencySafetyCapabilityStack}/>
      <HomeStack.Screen name="SosResponsePlanStack" component={SosResponsePlanCapabilityStack} options={{ headerShown: false }}/>
      <HomeStack.Screen name="InterFlatStack" component={InterFlatCapabilityStack}/>
      <HomeStack.Screen name="CommunityStack" component={CommunityCapabilityStack}/>
      <HomeStack.Screen name="DomesticHelpStack" component={DomesticHelpCapabilityStack}/>
      <HomeStack.Screen name="ProfileTab" component={ProfileCapabilityStack}/>
    </HomeStack.Navigator>);
}
function VisitorStackNavigator() {
    return (<VisitorStack.Navigator screenOptions={stackScreenOptions}>
      <VisitorStack.Screen name="VisitorList" component={VisitorListScreen}/>
      <VisitorStack.Screen name="VisitorDetail" component={VisitorDetailScreen}/>
      <VisitorStack.Screen name="CreateVisitorPass" component={CreateVisitorPassScreen}/>
    </VisitorStack.Navigator>);
}
function ComplaintStackNavigator() {
    return (<ComplaintStack.Navigator screenOptions={stackScreenOptions}>
      <ComplaintStack.Screen name="ComplaintList" component={ComplaintListScreen}/>
      <ComplaintStack.Screen name="ComplaintDetail" component={ComplaintDetailScreen}/>
      <ComplaintStack.Screen name="CreateComplaint" component={CreateComplaintScreen}/>
      <ComplaintStack.Screen name="ComplaintReopen" component={ComplaintReopenScreen}/>
      <ComplaintStack.Screen name="ComplaintFeedback" component={ComplaintFeedbackScreen}/>
    </ComplaintStack.Navigator>);
}
function BillStackNavigator() {
    return (<BillStack.Navigator screenOptions={stackScreenOptions}>
      <BillStack.Screen name="BillList" component={BillListScreen}/>
      <BillStack.Screen name="BillDetail" component={BillDetailScreen}/>
      <BillStack.Screen name="MockPaymentConfirmation" component={MockPaymentConfirmationScreen}/>
      <BillStack.Screen name="AdvancePayment" component={AdvancePaymentScreen}/>
      <BillStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen}/>
      <BillStack.Screen name="FlatLedger" component={FlatLedgerScreen}/>
    </BillStack.Navigator>);
}
function ChatStackNavigator() {
    return (<ChatStack.Navigator screenOptions={stackScreenOptions}>
      <ChatStack.Screen name="ChatHome" component={ResidentChatHomeScreen}/>
      <ChatStack.Screen name="Conversation" component={ResidentConversationScreen}/>
      <ChatStack.Screen name="ResidentDirectorySelection" component={ResidentDirectorySelectionScreen}/>
      <ChatStack.Screen name="NewResidentContactRequest" component={NewResidentContactRequestScreen}/>
      <ChatStack.Screen name="ResidentContactRequests" component={ResidentContactRequestsScreen}/>
      <ChatStack.Screen name="ResidentDirectConversation" component={ResidentDirectConversationScreen}/>
    </ChatStack.Navigator>);
}
function ResidentHomeCapabilityNavigator() {
    return <ResidentCapabilityGuard capabilityId="resident.homeContext"><HomeStackNavigator /></ResidentCapabilityGuard>;
}
function ResidentVisitorCapabilityNavigator() {
    return <ResidentCapabilityGuard capabilityId="resident.visitors"><VisitorStackNavigator /></ResidentCapabilityGuard>;
}
function ResidentComplaintCapabilityNavigator() {
    return <ResidentCapabilityGuard capabilityId="resident.complaints"><ComplaintStackNavigator /></ResidentCapabilityGuard>;
}
function ResidentBillingCapabilityNavigator() {
    return <ResidentCapabilityGuard capabilityId="resident.billing"><BillStackNavigator /></ResidentCapabilityGuard>;
}
function ResidentChatCapabilityNavigator() {
    return <ResidentCapabilityGuard capabilityId="resident.chat"><ChatStackNavigator /></ResidentCapabilityGuard>;
}
export function ResidentNavigator() {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const { unreadCount } = useResidentChatConversations();
    const contactRequests = useResidentContactRequests();
    const directConversations = useResidentDirectConversations();
    const incomingRequestCount = (contactRequests.incoming.data ?? []).filter((request) => request.status === 'pending').length;
    const directUnreadCount = (directConversations.data ?? []).reduce((total, conversation) => total + (conversation.unreadByResidentProfileId[contactRequests.scope.residentProfileId] ?? 0), 0);
    const combinedUnreadCount = unreadCount + incomingRequestCount + directUnreadCount;
    return (<KeyboardExperienceProvider><SocietyExperienceProvider><Tab.Navigator tabBar={(props) => <ResidentTabBar {...props}/>} screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                ...styles.tabBar,
                backgroundColor: colors.tabBarBackground,
                borderTopColor: colors.border
            },
            tabBarActiveTintColor: colors.tabBarActive,
            tabBarInactiveTintColor: colors.tabBarInactive,
            tabBarLabelStyle: styles.tabLabel,
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ focused, color, size }) => {
                const icons = residentTabIcons[route.name];
                const iconName = focused ? icons.filled : icons.outline;
                return (<Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size ?? 22} color={color}/>);
            }
        })}>
        <Tab.Screen name="HomeTab" component={ResidentHomeCapabilityNavigator} options={{
            tabBarLabel: messages.tabs.home,
            tabBarAccessibilityLabel: messages.accessibility.tabs.home
        }}/>
        <Tab.Screen name="ActivityTab" component={ResidentActivityScreen} options={{
            tabBarLabel: messages.tabs.activity,
            tabBarAccessibilityLabel: messages.accessibility.tabs.activity
        }}/>
        <Tab.Screen name="CommunityTab" component={CommunityCapabilityStack} options={{
            tabBarLabel: messages.tabs.community,
            tabBarAccessibilityLabel: messages.accessibility.tabs.community
        }}/>
        <Tab.Screen name="ServicesTab" component={ResidentServicesScreen} options={{
            tabBarLabel: messages.tabs.services,
            tabBarAccessibilityLabel: messages.accessibility.tabs.services
        }}/>
        <Tab.Screen name="VisitorTab" component={ResidentVisitorCapabilityNavigator} options={{
            tabBarLabel: messages.tabs.visitors,
            tabBarAccessibilityLabel: messages.accessibility.tabs.visitors
        }}/>
        <Tab.Screen name="ComplaintTab" component={ResidentComplaintCapabilityNavigator} options={{
            tabBarLabel: messages.tabs.complaints,
            tabBarAccessibilityLabel: messages.accessibility.tabs.complaints
        }}/>
        <Tab.Screen name="BillTab" component={ResidentBillingCapabilityNavigator} options={{
            tabBarLabel: messages.tabs.bills,
            tabBarAccessibilityLabel: messages.accessibility.tabs.bills
        }}/>
        <Tab.Screen name="ChatTab" component={ResidentChatCapabilityNavigator} options={{
            tabBarLabel: messages.tabs.chat,
            tabBarAccessibilityLabel: messages.accessibility.tabs.chat,
            ...includeWhenPresent("tabBarBadge", combinedUnreadCount > 0 ? combinedUnreadCount : undefined)
        }}/>
      </Tab.Navigator></SocietyExperienceProvider></KeyboardExperienceProvider>);
}
export default ResidentNavigator;
