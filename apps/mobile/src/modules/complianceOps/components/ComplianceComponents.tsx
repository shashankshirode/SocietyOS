import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { WarningBanner } from "../../../shared/feedback/WarningBanner";
import type { ComplianceTask } from "../../../shared/mock/complianceTasks.mock";
import type { ComplianceCalendarItem as ComplianceCalendarRecord } from "../../../shared/mock/complianceCalendar.mock";
import type { WastePickupRow as WastePickupRecord } from "../../../shared/mock/wastePickupSchedule.mock";
import type { HousekeepingRound } from "../../../shared/mock/housekeepingRounds.mock";
import type { HousekeepingScheduleRow } from "../../../shared/mock/housekeepingSchedule.mock";
import type { LiftRecord } from "../../../shared/mock/liftRegister.mock";
import type { LiftBreakdown } from "../../../shared/mock/liftBreakdowns.mock";
import type { FireEquipment } from "../../../shared/mock/fireEquipment.mock";
import type { FireDrillRecord } from "../../../shared/mock/fireDrills.mock";
import type { LiftCertificate } from "../../../shared/mock/liftCertificates.mock";
import { styles } from "../styles/components/ComplianceComponents.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function ComplianceMetricCard({ label, value, note, }: {
    label: string;
    value: string | number;
    note?: string;
}) {
    return (<AppCard style={styles.metricCard} padding="md">
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel} numberOfLines={2}>
        {label}
      </Text>
      {note && <Text style={styles.metricNote}>{note}</Text>}
    </AppCard>);
}
export function ComplianceTaskCard({ task, onPress }: {
    task: ComplianceTask;
    onPress: () => void;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard pressable style={styles.taskCard} onPress={onPress} padding="md">
      <View style={styles.cardHeader}>
        <Text style={styles.taskNumber} numberOfLines={1}>
          {task.taskNumber}
        </Text>
        <StatusBadge status={task.status} moduleType="complaint"/>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {task.title}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardSub} numberOfLines={1}>{localizedUiText.m_dffc2d63f00d}{task.assignedTo}
        </Text>
        <Text style={styles.cardSub} numberOfLines={1}>{localizedUiText.m_df5b477708b5}{task.dueDate}
        </Text>
      </View>
    </AppCard>);
}
export function ComplianceCalendarItem({ item, onPress }: {
    item: ComplianceCalendarRecord;
    onPress: () => void;
}) {
    return (<AppCard pressable style={styles.taskCard} onPress={onPress} padding="md">
      <View style={styles.row}>
        <View style={styles.calendarDateContainer}>
          <Ionicons name="calendar-outline" size={16} color={Colors.primary}/>
          <Text style={styles.calTime}>{item.dueDate}</Text>
        </View>
        <View style={styles.viewFlexMarginLeftMarginRight}>
          <Text style={styles.calTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.calSub} numberOfLines={1}>
            {item.category.replace(/_/g, ' ')} | {item.assignedTo}
          </Text>
        </View>
        <StatusBadge status={item.status} moduleType="noc"/>
      </View>
    </AppCard>);
}
export function WastePickupRow({ row, onMarkComplete, showAction, }: {
    row: WastePickupRecord;
    onMarkComplete: () => void;
    showAction: boolean;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard style={styles.hkCard} padding="md">
      <View style={styles.row}>
        <View style={styles.viewFlexMarginRight}>
          <Text style={styles.pickupTitle} numberOfLines={1}>
            {row.tower} - {row.floor}
          </Text>
          <Text style={styles.pickupSub} numberOfLines={1}>
            {row.pickupType.replace(/_/g, ' ')} | {row.scheduledTime}
          </Text>
          <Text style={styles.pickupSub} numberOfLines={1}>{localizedUiText.m_e822215345ac}{row.assignedStaff}
          </Text>
        </View>
        <View style={styles.viewAlignItemsJustifyContent}>
          <StatusBadge status={row.status} moduleType="visitor"/>
          {showAction && row.status !== 'COMPLETED' && (<AppCard pressable style={styles.miniBtn} padding="none" onPress={onMarkComplete}>
              <Text style={styles.miniBtnText}>{localizedUiText.m_660381496c10}</Text>
            </AppCard>)}
        </View>
      </View>
    </AppCard>);
}
export function HousekeepingRoundCard({ round, onPress }: {
    round: HousekeepingRound | HousekeepingScheduleRow;
    onPress: () => void;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard pressable style={styles.hkCard} onPress={onPress} padding="md">
      <View style={styles.cardHeader}>
        <Text style={styles.taskNumber} numberOfLines={1}>
          {'roundNumber' in round ? round.roundNumber : round.id}
        </Text>
        <StatusBadge status={round.status} moduleType="staff"/>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {round.area} - {round.cleaningType.replace(/_/g, ' ')}
      </Text>
      <Text style={styles.cardSub} numberOfLines={1}>{localizedUiText.m_e822215345ac}{round.assignedStaff}
      </Text>
    </AppCard>);
}
export function InspectionChecklistCard({ title, checked, onPress, }: {
    title: string;
    checked: boolean;
    onPress: () => void;
}) {
    return (<AppCard pressable style={styles.checklistCard} onPress={onPress} padding="sm">
      <View style={styles.row}>
        <View style={[styles.checkbox, checked && styles.checked]}>
          {checked && <Ionicons name="checkmark" size={14} color="#fff"/>}
        </View>
        <Text style={styles.checklistText} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </AppCard>);
}
export function LiftCard({ lift, onPress }: {
    lift: LiftRecord;
    onPress: () => void;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard pressable style={styles.hkCard} onPress={onPress} padding="md">
      <View style={styles.cardHeader}>
        <Text style={styles.liftNumber} numberOfLines={1}>
          {lift.liftNumber}
        </Text>
        <StatusBadge status={lift.status} moduleType="parking"/>
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {lift.tower} | {lift.type}
      </Text>
      <Text style={styles.cardSub} numberOfLines={1}>{localizedUiText.m_123c1b634210}{lift.vendor}{" " + localizedUiText.m_5a70ee13cbf4 + " "}{lift.breakdownCount}
      </Text>
    </AppCard>);
}
export function LiftBreakdownCard({ breakdown, onPress }: {
    breakdown: LiftBreakdown;
    onPress: () => void;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard pressable style={styles.hkCard} onPress={onPress} padding="md">
      <View style={styles.cardHeader}>
        <Text style={styles.liftNumber} numberOfLines={1}>
          {breakdown.liftNumber}
        </Text>
        <StatusBadge status={breakdown.status} moduleType="complaint"/>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {breakdown.breakdownType.replace(/_/g, ' ')}
      </Text>
      <Text style={styles.cardSub} numberOfLines={1}>{localizedUiText.m_bc9064e0d39a}{breakdown.startedAt}
      </Text>
    </AppCard>);
}
export function FireEquipmentCard({ equipment, onPress }: {
    equipment: FireEquipment;
    onPress: () => void;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard pressable style={styles.hkCard} onPress={onPress} padding="md">
      <View style={styles.cardHeader}>
        <Text style={styles.liftNumber} numberOfLines={1}>
          {equipment.equipmentCode}
        </Text>
        <StatusBadge status={equipment.status} moduleType="vendor"/>
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {equipment.name}
      </Text>
      <Text style={styles.cardSub} numberOfLines={1}>{localizedUiText.m_bbdffe25dc7d}{equipment.location}
      </Text>
    </AppCard>);
}
export function FireDrillCard({ drill, onPress }: {
    drill: FireDrillRecord;
    onPress: () => void;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard pressable style={styles.hkCard} onPress={onPress} padding="md">
      <View style={styles.cardHeader}>
        <Text style={styles.liftNumber} numberOfLines={1}>
          {drill.drillName}
        </Text>
        <StatusBadge status={drill.status} moduleType="staff"/>
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {drill.drillType.replace(/_/g, ' ')}
      </Text>
      <Text style={styles.cardSub} numberOfLines={1}>{localizedUiText.m_b51489bde8d8}{drill.date}{" " + localizedUiText.m_647158aecd03 + " "}{drill.targetArea}
      </Text>
    </AppCard>);
}
export function CertificateExpiryCard({ cert, onPress }: {
    cert: LiftCertificate;
    onPress: () => void;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard pressable style={styles.hkCard} onPress={onPress} padding="md">
      <View style={styles.cardHeader}>
        <Text style={styles.liftNumber} numberOfLines={1}>
          {cert.certificateNumber}
        </Text>
        <StatusBadge status={cert.status} moduleType="notice"/>
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {cert.liftNumber} - {cert.certificateType}
      </Text>
      <Text style={styles.cardSub} numberOfLines={1}>{localizedUiText.m_6486dd6ab9b6}{cert.expiryDate}
      </Text>
    </AppCard>);
}
export function ComplianceSafetyNotice() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<WarningBanner type="info" message={localizedUiText.m_53b75d41aeb2} style={styles.noticeBox}/>);
}

