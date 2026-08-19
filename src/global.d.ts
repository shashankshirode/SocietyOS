import { JsonValue as LocalJsonValue, JsonObject as LocalJsonObject } from './core/api/api.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
declare global {
    type JsonValue = LocalJsonValue;
    type JsonObject = LocalJsonObject;
    type LegacyNavigation = Pick<NativeStackNavigationProp<ParamListBase>, 'goBack' | 'navigate'> & Partial<Pick<NativeStackNavigationProp<ParamListBase>, 'canGoBack' | 'pop' | 'replace'>>;
    type BackOnlyScreenProps = {
        navigation: Pick<LegacyNavigation, 'goBack'>;
    };
    type LegacyRouteParams = Partial<{
        reportId: string;
        itemId: string;
        requestId: string;
        receiptId: string;
        unitId: string;
        liftId: string;
        equipmentId: string;
        drillId: string;
        taskId: string;
        cycleId: string;
        type: string;
        targetId: string;
        targetTitle: string;
        receiverId: string;
        receiverName: string;
        receiverUnit: string;
        listingId: string;
        roundId: string;
        deviceId: string;
        sessionId: string;
        profileId: string;
        meterId: string;
        proposalId: string;
        categorySlug: string;
        categoryName: string;
        residentId: string;
        issueId: string;
        ruleId: string;
        inspectionId: string;
        chargerId: string;
        eventId: string;
        recordId: string;
        recipientResidentId: string;
        mediationId: string;
        parcelId: string;
        issueType: string;
    }>;
    type LegacyRoute = {
        key: string;
        name: string;
        params: LegacyRouteParams;
    };
    type NavigationOnlyScreenProps = {
        navigation: LegacyNavigation;
    };
    type RouteOnlyScreenProps = {
        route: LegacyRoute;
    };
    type LegacyScreenProps = NavigationOnlyScreenProps & RouteOnlyScreenProps;
}
