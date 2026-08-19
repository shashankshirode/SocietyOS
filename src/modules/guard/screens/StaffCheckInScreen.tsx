import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppHeader } from "../../../shared/components/AppHeader";
import { WarningBanner } from "../../../shared/feedback/WarningBanner";
import { SearchBar } from "../../../shared/lists/SearchBar";
import { StatusBadge, getStaffVerificationBadgeType } from "../../../shared/components/StatusBadge";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { useStaffCheckIn, useStaffToday } from "../data/useStaffCheckIn";
import type { StaffCheckInScreenProps } from "../../../app/navigation/navigation.types";
import type { StaffMember } from "../../../shared/types/staff.types";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/StaffCheckInScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
export function StaffCheckInScreen({ navigation }: StaffCheckInScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [searchQuery, setSearchQuery] = useState('');
    const { data: staffData, isLoading, error, refetch } = useStaffToday();
    const { submit: submitCheckIn } = useStaffCheckIn();
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [overrideList, setOverrideList] = useState<Record<string, boolean>>({});
    React.useEffect(() => {
        setStaffList(staffData ?? []);
    }, [staffData]);
    const filteredStaff = React.useMemo(() => {
        if (!searchQuery.trim())
            return staffList;
        const q = searchQuery.toLowerCase();
        return staffList.filter((s) => s.name.toLowerCase().includes(q) ||
            s.staffType.toLowerCase().includes(q) ||
            s.idBadgeNumber.toLowerCase().includes(q));
    }, [searchQuery, staffList]);
    const handleToggleCheck = async (memberId: string) => {
        const member = staffList.find((s) => s.id === memberId);
        if (!member)
            return;
        if (member.verificationStatus === 'BLOCKED') {
            AppAlert.alert(String(localizedUiText.m_fceca6a72c80), String(localizedUiText.m_a1e60aa4a9c1), [
                { text: String(localizedUiText.m_565339bc4d33) },
            ]);
            return;
        }
        if (member.verificationStatus === 'EXPIRED' && !overrideList[memberId]) {
            AppAlert.alert(String(localizedUiText.m_8bbafe99c494), String(localizedUiText.m_622fcb8de5cd), [{ text: String(localizedUiText.m_565339bc4d33) }]);
            return;
        }
        await submitCheckIn(memberId);
        setStaffList((prev) => prev.map((s) => {
            if (s.id === memberId) {
                const isCheckedIn = s.attendanceStatus === 'CHECKED_IN';
                const newStatus = isCheckedIn ? 'CHECKED_OUT' : 'CHECKED_IN';
                const newTime = isCheckedIn
                    ? s.lastCheckIn
                    : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                AppAlert.alert(newStatus === 'CHECKED_IN' ? String(localizedUiText.m_c323a4690351) : String(localizedUiText.m_33c45942a291), formatUiLiteral(String(localizedUiText.m_6b2a6519497b), [s.name, newStatus === 'CHECKED_IN' ? String(localizedUiText.m_17c05c08a9ac) : String(localizedUiText.m_cbe2b33735c6), newTime]));
                return {
                    ...s,
                    attendanceStatus: newStatus,
                    ...includeWhenPresent("lastCheckIn", newTime)
                };
            }
            return s;
        }));
    };
    const handleToggleOverride = (memberId: string) => {
        setOverrideList((prev) => ({
            ...prev,
            [memberId]: !prev[memberId]
        }));
    };
    const renderStaffItem = ({ item, index }: {
        item: StaffMember;
        index: number;
    }) => {
        const isCheckedIn = item.attendanceStatus === 'CHECKED_IN';
        const isBlocked = item.verificationStatus === 'BLOCKED';
        const isExpired = item.verificationStatus === 'EXPIRED';
        const isOverridden = overrideList[item.id] || false;
        return (<AppCard style={styles.staffCard} animated animationDelay={index * 30}>
        <View style={styles.cardHeader}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Ionicons name="person-circle-outline" size={32} color={Colors.primary}/>
            </View>
            <View style={styles.profileText}>
              <Text style={styles.staffName}>{item.name}</Text>
              <Text style={styles.staffType}>
                {item.staffType}{" " + localizedUiText.m_e74c2646dfd1 + " "}{item.idBadgeNumber}
              </Text>
            </View>
          </View>
          <StatusBadge label={item.verificationStatus} type={getStaffVerificationBadgeType(item.verificationStatus)}/>
        </View>

        
        <View style={styles.flatsRow}>
          <Ionicons name="business-outline" size={14} color={Colors.textSecondary}/>
          <Text style={styles.flatsText}>{localizedUiText.m_3dbffb0238ae + " "}{item.linkedFlats.join(', ')}</Text>
        </View>

        
        {isBlocked && (<WarningBanner message={localizedUiText.m_b2dfa1d64c57} type="danger" style={styles.bannerMargin}/>)}
        {isExpired && !isOverridden && (<WarningBanner message={localizedUiText.m_39f7a5821ace} type="warning" style={styles.bannerMargin}/>)}

        
        {item.lastCheckIn ? (<Text style={styles.checkInTimeText}>{localizedUiText.m_74954f0ed41c}{item.lastCheckIn} ({item.attendanceStatus.replace('_', ' ')})
          </Text>) : null}

        
        <View style={styles.cardFooter}>
          {isExpired ? (<Pressable style={[styles.overrideBtn, isOverridden && styles.overrideBtnActive]} onPress={() => handleToggleOverride(item.id)}>
              <Ionicons name={isOverridden ? 'lock-open-outline' : 'lock-closed-outline'} size={14} color={isOverridden ? Colors.success : Colors.textSecondary}/>
              <Text style={[styles.overrideBtnText, isOverridden && styles.overrideBtnTextActive]}>{localizedUiText.m_01e9818aa60d}</Text>
            </Pressable>) : (<View style={styles.viewFlex}/>)}

          <Pressable style={[
                styles.actionBtn,
                isCheckedIn ? styles.checkOutBtn : styles.checkInBtn,
                isBlocked ? styles.disabledBtn : styles.pressable,
            ]} onPress={() => handleToggleCheck(item.id)} disabled={isBlocked}>
            <Text style={styles.actionBtnText}>{isCheckedIn ? localizedUiText.m_5b4ecf4c9808 : localizedUiText.m_f49fc7767bcf}</Text>
          </Pressable>
        </View>
      </AppCard>);
    };
    if (isLoading) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_799b9fc86fe7} showBack onBack={() => navigation.goBack()}/>
        <LoadingState message={localizedUiText.m_b2b699c49ee8} showCardPlaceholder/>
      </SafeAreaView>);
    }
    if (error) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_799b9fc86fe7} showBack onBack={() => navigation.goBack()}/>
        <ErrorState message={error.message} onRetry={refetch}/>
      </SafeAreaView>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_799b9fc86fe7} showBack onBack={() => navigation.goBack()}/>

      <View style={styles.searchContainer}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder={localizedUiText.m_41116b280e33}/>
      </View>

      <FlatList data={filteredStaff} renderItem={renderStaffItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}/>
    </SafeAreaView>);
}

