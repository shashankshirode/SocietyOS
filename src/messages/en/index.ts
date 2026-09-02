import { uiLiteralMessages } from './uiLiterals.generated';
import { commonMessages } from './common.messages';
import { navigationMessages } from './navigation.messages';
import { accessibilityMessages } from './accessibility.messages';
import { residentDashboardMessages } from './residentDashboard.messages';
import { residentExperienceMessages } from './residentExperience.messages';
import { residentPriorityMessages } from './residentPriority.messages';
import { residentPulseMessages } from './residentPulse.messages';
import { residentVisitorsMessages } from './residentVisitors.messages';
import { residentBillingMessages } from './residentBilling.messages';
import { residentComplaintsMessages } from './residentComplaints.messages';
import { residentNoticesMessages } from './residentNotices.messages';
import { residentDocumentsMessages } from './residentDocuments.messages';
import { residentNocMessages } from './residentNoc.messages';
import { residentMoveInMoveOutMessages } from './residentMoveInMoveOut.messages';
import { residentProfileMessages } from './residentProfile.messages';
import { residentHouseholdMessages } from './residentHousehold.messages';
import { residentHomeContextMessages } from './residentHomeContext.messages';
import { residentFamilyMessages } from './residentFamily.messages';
import { residentTenantMessages } from './residentTenant.messages';
import { residentConnectMessages } from './residentConnect.messages';
import { residentInterFlatIssuesMessages } from './residentInterFlatIssues.messages';
import { residentFacilityBookingMessages } from './residentFacilityBooking.messages';
import { residentParkingMessages } from './residentParking.messages';
import { residentRulesMessages } from './residentRules.messages';
import { residentGovernanceMessages } from './residentGovernance.messages';
import { residentEmergencyMessages } from './residentEmergency.messages';
import { residentMarketplaceMessages } from './residentMarketplace.messages';
import { contactRequestMessages } from './contactRequest.messages';
import { settingsMessages } from './settings.messages';
import { residentLoadingMessages } from './residentLoading.messages';
import { residentModalMessages } from './residentModal.messages';
import { residentValidationMessages } from './residentValidation.messages';
import { residentMockScenariosMessages } from './residentMockScenarios.messages';
import { residentComponentFixturesMessages } from './residentComponentFixtures.messages';
import { residentEmptyStatesMessages } from './residentEmptyStates.messages';
import { residentErrorsMessages } from './residentErrors.messages';
import { residentSuccessMessages } from './residentSuccess.messages';
import { residentJourneyMessages } from './residentJourney.messages';
import { residentActionsMessages } from './residentActions.messages';
import { residentAccessibilityMessages } from './residentAccessibility.messages';
import { residentContextualInsightsMessages } from './residentContextualInsights.messages';
import { residentPrerequisitesMessages } from './residentPrerequisites.messages';
import { residentImagesMessages } from './residentImages.messages';
import { residentPlatformMessages } from './residentPlatform.messages';
import { visitorExitAssuranceMessages } from './visitorExitAssurance.messages';
import { residentNotificationsMessages } from './residentNotifications.messages';
import { statusLabelsMessages } from './statusLabels.messages';
import { residentMockDataMessages } from './residentMockData.messages';
import { residentInsightsMessages } from './residentInsights.messages';
import { residentChatMessages } from './residentChat.messages';
import { chatChannelsMessages } from './chatChannels.messages';
import { channelMembershipMessages } from './channelMembership.messages';
import { guardChatMessages } from './guardChat.messages';
import { departmentChatMessages } from './departmentChat.messages';
import { staffRegistrationMessages } from './staffRegistration.messages';
import { residentDomesticHelpMessages } from './residentDomesticHelp.messages';
const residentDashboardInsightsMessages = {
    title: 'Daily Insights',
    subtitle: 'Weather, safety and nearby alerts for your home area',
    viewDetails: 'View Details',
    dismiss: 'Dismiss',
    markAsRead: 'Got it',
    learnMore: 'Learn More',
    whyAmISeeingThis: 'Why am I seeing this?',
    aboutTitle: 'How insights work',
    aboutDescription: 'Insights blend local conditions, society updates and trusted advisory signals into one resident-first view.',
    whyThisMatters: 'Why this matters',
    recommendationTitle: 'Suggested today',
    reportedBy: 'Signal from',
    priorityLabel: 'Alert priority',
    areaLabel: 'Area',
    verified: 'Verified',
    impactSummary: 'A quick check now can reduce avoidable delay and help you choose a safer route or timing.',
    titleByCategory: {
        weather: 'Local Weather Update',
        traffic: 'Traffic and Access Advisory',
        civic: 'Civic Conditions Advisory',
        society: 'Society Bulletin Update',
        safety: 'Community Safety Advisory',
        utility: 'Utility and Maintenance Advisory',
    },
    source: {
        system: 'Society OS intelligence',
        facilityTeam: 'Facility team',
        societyOffice: 'Society office',
        weatherService: 'Weather service',
        localAuthority: 'Local authority feed',
    },
    freshness: {
        justNow: 'Updated just now',
        minutesAgo: (minutes: number | string) => `Updated ${minutes} min ago`,
        hoursAgo: (hours: number | string) => `Updated ${hours} hr ago`,
    },
    area: {
        localArea: 'Nearby society area',
    },
    infoPoints: {
        source: 'Signals are grouped by category and source so you can judge urgency quickly.',
        unitContext: 'Your active home context decides which local updates are shown first.',
    },
    category: {
        weather: 'Weather Alert',
        traffic: 'Traffic & Roads',
        civic: 'Civic Update',
        society: 'Society Update',
        safety: 'Safety Warning',
        utility: 'Utility Maintenance',
    },
    priority: {
        low: 'Low Priority',
        medium: 'Medium Alert',
        high: 'High Risk',
        critical: 'Critical Emergency',
    },
    empty: {
        title: 'You\'re All Clear',
        description: 'No active local alerts or advisories for your area right now.',
    },
    error: {
        title: 'Unable to Load Insights',
        description: 'We encountered an error fetching local safety updates. Please try again.',
    },
    retry: 'Retry Fetch',
    close: 'Close Panel',
} as const;
export const enMessages = {
    uiLiterals: uiLiteralMessages,
    common: commonMessages,
    accessibility: accessibilityMessages,
    navigation: navigationMessages,
    chat: {
        ...chatChannelsMessages,
        membership: channelMembershipMessages,
        errors: {
            apiNotConfigured: 'Chat API mode is not configured yet.',
            loadFailed: 'Chats could not be loaded. Check your connection and try again.',
            conversationUnavailable: 'This conversation is not available for the active home.',
            channelUnavailable: 'This channel is disabled or unavailable.',
            sendFailed: 'The message was not sent. Try again.',
            olderMessagesFailed: 'Older messages could not be loaded.',
            noGuardAvailable: 'No on-duty guard is available right now. Try again shortly.',
            interactionExpired: 'This gate interaction has ended. Send a new Security Gate message.',
            guardOffDuty: 'Your gate shift is not active. A new message cannot be sent from this assignment.',
            membershipUnavailable: 'This channel membership is no longer available.',
        },
        validation: channelMembershipMessages.validation,
        access: {
            membershipMissing: 'You are not assigned to this channel.',
            membershipInactive: 'Your channel membership is not active.',
            channelDisabled: 'This channel is disabled.',
            wrongSociety: 'This conversation belongs to another society.',
            interactionNotAssigned: 'This Security Gate interaction is assigned to another guard.',
            permissionMissing: 'Your membership does not allow this action.',
            staffInactive: 'Your staff profile is not active.',
        },
    },
    guard: { chat: guardChatMessages },
    department: { chat: departmentChatMessages },
    staff: { registration: staffRegistrationMessages },
    buttons: {
        save: 'Save',
        submit: 'Submit',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        confirm: 'Confirm',
        retry: 'Retry',
        refresh: 'Refresh',
        viewAll: 'View All',
        seeMore: 'See More',
        done: 'Done',
        next: 'Next',
        previous: 'Previous',
        back: 'Back',
        create: 'Create',
        update: 'Update',
        share: 'Share',
        addTenant: 'Add Tenant',
        viewCurrentTenant: 'View Current Tenant',
        initiateTenantExit: 'Initiate Tenant Exit',
    },
    visitor: {
        exitAssurance: visitorExitAssuranceMessages,
        validation: {
            expectedExitRequired: 'Expected exit time is required for this visitor type.',
            expectedExitAfterEntry: 'Expected exit time must be after expected entry time.',
            expectedExitWithinPassValidity: 'Expected exit time must be within pass validity.',
        },
        accessibility: {
            openExitAlert: 'Open visitor exit alert',
            confirmVisitorLeft: 'Confirm visitor has left',
            extendVisitorExitTime: 'Extend visitor expected exit time',
        },
    },
    statusLabels: statusLabelsMessages,
    mockScenarios: residentMockScenariosMessages,
    componentFixtures: residentComponentFixturesMessages,
    emptyStates: residentEmptyStatesMessages,
    errors: residentErrorsMessages,
    success: residentSuccessMessages,
    journey: residentJourneyMessages,
    actions: residentActionsMessages,
    residentAccessibility: residentAccessibilityMessages,
    tabs: {
        home: 'Home',
        activity: 'Activity',
        community: 'Community',
        services: 'Services',
        visitors: 'Visitors',
        complaints: 'Complaints',
        bills: 'Bills',
        profile: 'Profile',
        chat: 'Chat',
    },
    resident: {
        navigation: {
            home: { title: 'Home', subtitle: 'Your society at a glance' },
            visitors: { title: 'Visitor Passes', subtitle: 'Manage flat gate access passes' },
            complaints: { title: 'Complaints', subtitle: 'Track service requests and SLA' },
            bills: { title: 'Bills & Payments', subtitle: 'Maintenance, receipts and ledger' },
            profile: { title: 'Profile', subtitle: 'Your unit, family and access' },
            household: { title: 'Household', subtitle: 'Family, tenant and access controls' },
            familyMembers: { title: 'Family Members', subtitle: 'Manage family profiles and access' },
            addFamilyMember: { title: 'Add Family Member', subtitle: 'Create a family profile with controlled permissions' },
            editFamilyMember: { title: 'Edit Family Member', subtitle: 'Update family profile and safety details' },
            familyMemberDetail: { title: 'Family Member Detail', subtitle: 'Review profile, access and emergency status' },
            familyAccessPermissions: { title: 'Family Access Permissions', subtitle: 'Control family member app permissions' },
            tenantManagement: { title: 'Tenant Management', subtitle: 'Onboarding, verification and access status' },
            addTenant: { title: 'Add Tenant', subtitle: 'Guided tenant onboarding request' },
            tenantStatus: { title: 'Tenant Status', subtitle: 'Track approval and access activation' },
            tenantDetail: { title: 'Tenant Detail', subtitle: 'Tenant profile, documents and access' },
            communityHub: { title: 'Community Hub', subtitle: 'Marketplace, skills, borrow and lend' },
            marketplace: { title: 'Marketplace', subtitle: 'Buy, sell and discover society services' },
            documents: { title: 'Document Vault', subtitle: 'Secure, verified and access controlled' },
            facilities: { title: 'Facility Bookings', subtitle: 'Book clubhouses, sports slots, and guest rooms' },
            emergency: { title: 'Emergency', subtitle: 'SOS, family connect and responder alerts' },
            settings: { title: 'Settings', subtitle: 'Privacy, notifications and app preferences' },
            chat: { title: 'Chat', subtitle: 'Chat with the gate, society teams and approved residents' },
        },
        tablet: {
            summaryRail: {
                title: 'Summary',
            },
            insightPanel: {
                title: 'Insights',
            },
            actionDock: {
                title: 'Actions',
            },
            timelinePanel: {
                title: 'Timeline',
            },
        },
        dashboard: {
            ...residentDashboardMessages,
            insights: residentDashboardInsightsMessages,
        },
        experience: residentExperienceMessages,
        priority: residentPriorityMessages,
        pulse: residentPulseMessages,
        prerequisites: residentPrerequisitesMessages,
        images: residentImagesMessages,
        platform: residentPlatformMessages,
        mockData: residentMockDataMessages,
        insights: residentInsightsMessages,
        chat: residentChatMessages,
        header: {
            contextResidentApp: 'Resident app',
            roles: {
                owner: 'Owner',
                tenant: 'Tenant',
                family: 'Family',
            },
            backAccessibilityLabel: 'Go back',
            defaultActionAccessibilityLabel: 'Open resident action',
        },
        accessibility: {
            household: {
                openFamilyMember: 'Open family member details',
                tenantStepper: 'Tenant onboarding progress',
                mockUploadDocument: 'Mock upload tenant document',
            },
            homeContext: {
                openSwitcher: 'Open home and society switcher bottom sheet',
                closeSwitcher: 'Close home switcher bottom sheet',
                selectHome: 'Select flat context',
                currentHome: 'Current selected home',
                switchingHome: 'Home switch in progress',
            },
            dashboardInsights: {
                close: 'Close daily insights panel',
                viewDetails: 'View details for this daily insight',
                dismiss: 'Dismiss this daily insight',
                markAsRead: 'Mark this daily insight as read',
                learnMore: 'Learn why this daily insight is shown',
            },
            dailyInsights: {
                close: 'Close daily insights',
                dragHandle: 'Drag down to close Daily Insights',
            },
        },
        releaseReadiness: {
            screenTitle: 'Release readiness',
            screenSubtitle: 'Resident app quality gate',
            scoreLabel: 'Release score',
            passedLabel: 'Passed',
            failedLabel: 'Failed',
            partialLabel: 'Partial',
            notApplicableLabel: 'Not applicable',
            checklistTitle: 'Checklist',
            gapsTitle: 'Gaps',
            noGaps: 'No gaps',
            missingScreens: 'Missing screens',
            missingRoutes: 'Missing routes',
            missingActions: 'Missing actions',
            missingRepositoryMethods: 'Missing repository methods',
            missingMockData: 'Missing mock data',
            missingMessages: 'Missing message groups',
            missingLoadingStates: 'Missing loading states',
            missingModals: 'Missing modals',
            missingRoleVariants: 'Missing role variants',
            missingFeatureFlags: 'Missing feature flags',
            centralizedDataSourceViolations: 'Centralized data-source violations',
            hardcodedStringViolations: 'Hardcoded string violations',
            forbiddenTypeViolations: 'Forbidden type violations',
            existingForbiddenTypes: 'Existing strict type scan still reports forbidden resident any or unknown usage.',
            existingHardcodedStrings: 'Existing resident UI scan still reports hardcoded screen text or accessibility copy.',
            noCentralizedDataSourceViolations: 'No direct resident data-source bypasses detected in the latest scan.',
            releaseBlocked: 'Release blocked',
            releaseReady: 'Release ready',
            dashboardActions: 'Dashboard action completion',
            registryCoverage: 'Feature registry coverage',
            staticQualitySignals: 'Static quality signals',
        },
        visitors: residentVisitorsMessages,
        visitorExitAssurance: visitorExitAssuranceMessages,
        notifications: {
            ...residentNotificationsMessages,
            title: 'Notifications',
            visitors: 'Visitor updates',
            complaints: 'Complaint updates',
            billing: 'Payment reminders',
            notices: 'New notices',
            emergency: 'Emergency alerts',
            connect: 'Chat requests',
            marketplace: 'Service requests',
        },
        billing: residentBillingMessages,
        complaints: residentComplaintsMessages,
        notices: residentNoticesMessages,
        documents: residentDocumentsMessages,
        noc: residentNocMessages,
        moveInMoveOut: residentMoveInMoveOutMessages,
        profile: residentProfileMessages,
        household: residentHouseholdMessages,
        homeContext: residentHomeContextMessages,
        family: residentFamilyMessages,
        tenant: residentTenantMessages,
        residentConnect: residentConnectMessages,
        connect: residentConnectMessages,
        contactRequest: contactRequestMessages,
        privacy: {
            directoryTitle: 'Privacy Directory',
            settingsTitle: 'Privacy Settings',
            phoneHidden: 'Phone number hidden',
            emailHidden: 'Email hidden',
            profileVisibility: 'Profile Visibility',
            dataProtectionNote: 'Your data is protected and never shared without consent.',
        },
        interFlatIssues: residentInterFlatIssuesMessages,
        facilityBooking: residentFacilityBookingMessages,
        facilityBookings: {
            empty: {
                title: 'No facility bookings yet',
                description: 'Reserve your society’s available amenities and manage upcoming bookings from here.',
                primaryAction: 'Book a Facility',
            },
            filterEmpty: {
                upcoming: {
                    title: 'No upcoming bookings',
                    description: 'Your future facility reservations will appear here.',
                },
                completed: {
                    title: 'No completed bookings',
                    description: 'Bookings you have already used will appear here.',
                },
                cancelled: {
                    title: 'No cancelled bookings',
                    description: 'Cancelled reservations will appear here.',
                },
            },
            error: {
                title: 'Unable to load bookings',
                description: 'We could not retrieve your facility bookings. Check your connection and try again.',
            },
        },
        parking: residentParkingMessages,
        rules: residentRulesMessages,
        governance: residentGovernanceMessages,
        emergency: residentEmergencyMessages,
        seniorCare: {
            dashboardTitle: 'Senior Care',
            dailyCheckIn: 'Daily Check-in',
            checkInSubmit: 'Submit Check-in',
            checkInStatus: 'Check-in Status',
            feelingGood: 'Feeling Good',
            needAssistance: 'Need Assistance',
            emergency: 'Emergency',
            priorityComplaint: 'Priority Complaint',
            inactivityAlerts: 'Inactivity Alerts',
            familyConnect: 'Family Connect',
            familyContacts: 'Family Contacts',
            addFamilyContact: 'Add Family Contact',
            emptyTitle: 'No check-ins yet',
            emptyDescription: 'Your daily check-in history will appear here.',
        },
        volunteers: {
            networkTitle: 'Volunteer Network',
            registerTitle: 'Register as Volunteer',
            directoryTitle: 'Volunteer Directory',
            availabilityTitle: 'Availability',
            alertDetailTitle: 'Alert Detail',
            accessibilityTitle: 'Accessibility',
            register: 'Register',
            updateAvailability: 'Update Availability',
            available: 'Available',
            unavailable: 'Unavailable',
            emptyTitle: 'No volunteers registered',
            emptyDescription: 'Register as a volunteer to help during emergencies.',
        },
        marketplace: residentMarketplaceMessages,
        settings: settingsMessages,
        loading: residentLoadingMessages,
        emptyStates: {
            generic: 'Nothing here yet',
            genericDescription: 'Content will appear here once available.',
            noData: 'No data available',
            noDataDescription: 'Check back later for updates.',
            noConnection: 'No connection',
            noConnectionDescription: 'Please check your internet connection and try again.',
        },
        errors: {
            generic: 'Something went wrong',
            genericDescription: 'An unexpected error occurred. Please try again.',
            networkError: 'Network error',
            networkDescription: 'Unable to connect. Check your internet connection.',
            permissionDenied: 'Permission denied',
            permissionDescription: 'You do not have access to this feature.',
            notFound: 'Not found',
            notFoundDescription: 'The requested resource was not found.',
            timeout: 'Request timed out',
            timeoutDescription: 'The server took too long to respond. Please try again.',
            featureUnavailable: 'Feature unavailable',
            featureUnavailableDescription: 'This feature is not currently enabled for your account.',
        },
        success: {
            generic: 'Success',
            saved: 'Saved successfully',
            submitted: 'Submitted successfully',
            updated: 'Updated successfully',
            deleted: 'Deleted successfully',
            created: 'Created successfully',
        },
        modals: residentModalMessages,
        buttons: {
            save: 'Save',
            submit: 'Submit',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            close: 'Close',
            confirm: 'Confirm',
            retry: 'Retry',
            refresh: 'Refresh',
            viewAll: 'View All',
            seeMore: 'See More',
            done: 'Done',
            next: 'Next',
            previous: 'Previous',
            back: 'Back',
            create: 'Create',
            update: 'Update',
            share: 'Share',
            download: 'Download',
            upload: 'Upload',
        },
        status: {
            active: 'Active',
            inactive: 'Inactive',
            pending: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected',
            expired: 'Expired',
            completed: 'Completed',
            cancelled: 'Cancelled',
            inProgress: 'In Progress',
            onHold: 'On Hold',
            draft: 'Draft',
            submitted: 'Submitted',
            underReview: 'Under Review',
            resolved: 'Resolved',
            closed: 'Closed',
        },
        contextualInsights: residentContextualInsightsMessages,
        domesticHelp: residentDomesticHelpMessages,
    },
    home: residentDashboardMessages,
    experience: residentExperienceMessages,
    priority: residentPriorityMessages,
    pulse: residentPulseMessages,
    prerequisites: residentPrerequisitesMessages,
    images: residentImagesMessages,
    platform: residentPlatformMessages,
    visitors: residentVisitorsMessages,
    complaints: residentComplaintsMessages,
    bills: residentBillingMessages,
    profile: residentProfileMessages,
    notices: residentNoticesMessages,
    emergency: residentEmergencyMessages,
    helpdesk: {
        screenTitle: 'Help & Support',
        faqTitle: 'Frequently Asked Questions',
        contactTitle: 'Need more help?',
        contactDescription: 'Reach out to your society admin or our support team.',
        contactAdmin: 'Contact Society Admin',
        reportIssue: 'Report an App Issue',
        reportIssueSub: 'Something not working? Let us know.',
    },
    documents: residentDocumentsMessages,
    noc: residentNocMessages,
    validation: residentValidationMessages,
    contactRequest: contactRequestMessages,
    settings: settingsMessages,
    domesticHelp: residentDomesticHelpMessages,
} as const;
export type EnglishMessagesType = typeof enMessages;
export default enMessages;
