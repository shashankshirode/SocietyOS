import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { AppHeader } from "../../../shared/components/AppHeader";
import { WarningBanner } from "../../../shared/feedback/WarningBanner";
import { StatusBadge, getOfflineSyncBadgeType } from "../../../shared/components/StatusBadge";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { useOfflineQueue } from "../data/useOfflineQueue";
import type { OfflineQueueScreenProps } from "../../../app/navigation/navigation.types";
import type { OfflineQueueItem } from "../../../shared/types/gate.types";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/OfflineQueueScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
export function OfflineQueueScreen({ navigation }: OfflineQueueScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useOfflineQueue();
    const [queue, setQueue] = useState<OfflineQueueItem[]>([]);
    React.useEffect(() => {
        setQueue(data ?? []);
    }, [data]);
    const handleRetrySync = (id: string) => {
        setQueue((prev) => prev.map((item) => {
            if (item.id === id) {
                AppAlert.alert(String(localizedUiText.m_e03bf0a01d33), formatUiLiteral(String(localizedUiText.m_7aece656dc05), [item.personName]));
                return {
                    ...item,
                    syncStatus: 'SYNCED',
                    ...includeWhenPresent("errorMessage", undefined)
                };
            }
            return item;
        }));
    };
    const handleMarkSynced = (id: string) => {
        setQueue((prev) => prev.filter((item) => item.id !== id));
        AppAlert.alert(String(localizedUiText.m_cf4d6ba6a1bb), String(localizedUiText.m_04f2a298acbb));
    };
    const renderQueueItem = ({ item, index }: {
        item: OfflineQueueItem;
        index: number;
    }) => {
        const isPending = item.syncStatus === 'PENDING_SYNC' || item.syncStatus === 'FAILED';
        return (<AppCard style={styles.queueCard} animated animationDelay={index * 30}>
        <View style={styles.row}>
          <View style={styles.details}>
            <Text style={styles.name}>{item.personName}</Text>
            <Text style={styles.meta}>{localizedUiText.m_9285cedcf26a}{item.flatNumber} · {item.entryType}{" " + localizedUiText.m_c116a61e8050 + " "}{item.createdTime}
            </Text>
            {item.errorMessage ? (<Text style={styles.errorText}>{localizedUiText.m_617062906764 + " "}{item.errorMessage}</Text>) : null}
          </View>
          <StatusBadge label={item.syncStatus.replace('_', ' ')} type={getOfflineSyncBadgeType(item.syncStatus)}/>
        </View>

        {isPending ? (<View style={styles.actions}>
            <View style={styles.viewFlex}>
              <AppButton title={localizedUiText.m_af458b97e40b} onPress={() => handleRetrySync(item.id)} variant="primary" compact/>
            </View>
            <View style={styles.viewFlexMarginLeft}>
              <AppButton title={localizedUiText.m_5ad90aca6997} onPress={() => handleMarkSynced(item.id)} variant="secondary" compact/>
            </View>
          </View>) : null}
      </AppCard>);
    };
    if (isLoading) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_2321b88e7e22} showBack onBack={() => navigation.goBack()}/>
        <LoadingState message={localizedUiText.m_6ebc4db796cc} showCardPlaceholder/>
      </SafeAreaView>);
    }
    if (error) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_2321b88e7e22} showBack onBack={() => navigation.goBack()}/>
        <ErrorState message={error.message} onRetry={refetch}/>
      </SafeAreaView>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_2321b88e7e22} showBack onBack={() => navigation.goBack()}/>
      <View style={styles.content}>
        <WarningBanner message={localizedUiText.m_5cf46214da48} type="info" style={styles.banner}/>

        <FlatList data={queue} renderItem={renderQueueItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}/>
      </View>
    </SafeAreaView>);
}

