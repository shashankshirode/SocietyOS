import { Share, Text, View } from "react-native";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { AppButton } from "../../../../shared/components/AppButton";
import { StatusBadge, getParkingBadgeType } from "../../../../shared/components/StatusBadge";
import { useVisitorParking } from "../data/useVisitorParking";
import { useCancelVisitorParkingPass, useExtendVisitorParkingPass } from "../data/useParkingActions";
import { DetailCard, DetailRow, labelize, ParkingScreen } from "../components/ParkingUi";
import type { VisitorParkingPassDetailScreenProps } from "../../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/VisitorParkingPassDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export function VisitorParkingPassDetailScreen({ navigation, route }: VisitorParkingPassDetailScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data = [], isLoading, error, refetch } = useVisitorParking('unit-a-1204');
    const cancelPass = useCancelVisitorParkingPass();
    const extendPass = useExtendVisitorParkingPass();
    const pass = data.find((item) => item.id === route.params.passId);
    if (isLoading) {
        return <LoadingState message={localizedUiText.m_4a97fe0692f3} showCardPlaceholder/>;
    }
    if (error) {
        return <ErrorState message={error.message} onRetry={refetch}/>;
    }
    if (!pass) {
        return <ErrorState message={localizedUiText.m_970b3191334d} onRetry={refetch}/>;
    }
    const currentPass = pass;
    const canModify = !['USED', 'EXPIRED', 'CANCELLED', 'REJECTED'].includes(currentPass.status);
    async function handleShare() {
        await Share.share({
            title: formatUiLiteral(String(localizedUiText.m_810e2c39cfe0), [currentPass.passNumber]),
            message: formatUiLiteral(String(localizedUiText.m_a3060a1d87eb), [currentPass.visitorName, currentPass.vehicleNumber, currentPass.passNumber, currentPass.validFrom, currentPass.validUntil]),
        });
    }
    async function handleCancel() {
        const result = await cancelPass.submit(currentPass.id);
        if (result.ok)
            await refetch();
    }
    async function handleExtend() {
        const result = await extendPass.submit({ passId: currentPass.id, hours: 2 });
        if (result.ok)
            await refetch();
    }
    return (<ParkingScreen title={pass.passNumber} subtitle={`${pass.visitorName} · ${pass.vehicleNumber}`} onBack={navigation.goBack}>
      <DetailCard title={localizedUiText.m_5d9c678a0f64}>
        <StatusBadge label={labelize(pass.status)} type={getParkingBadgeType(pass.status)}/>
      </DetailCard>
      <DetailCard title={localizedUiText.m_6db2a65e40fc}>
        <DetailRow label={localizedUiText.m_cf9f5896322a} value={pass.visitorName}/>
        <DetailRow label={localizedUiText.m_cbaad3cf4a65} value={pass.mobileMasked}/>
        <DetailRow label={localizedUiText.m_a62394ba4acc} value={`${pass.vehicleNumber} · ${labelize(pass.vehicleType)}`}/>
        <DetailRow label={localizedUiText.m_f57f06910d21} value={pass.visitingFlat}/>
        <DetailRow label={localizedUiText.m_b8ca7f845b99} value={pass.approvedParkingZone}/>
        <DetailRow label={localizedUiText.m_9a56d91b5571} value={pass.validFrom}/>
        <DetailRow label={localizedUiText.m_92cd054da773} value={pass.validUntil} isLast/>
      </DetailCard>
      <DetailCard title={localizedUiText.m_126b81dba982}>
        <View style={styles.qrBox}>
          <Text style={styles.qrText}>{pass.passNumber}</Text>
          <Text style={styles.qrSub}>{localizedUiText.m_e504d81e2412}</Text>
        </View>
      </DetailCard>
      <DetailCard title={localizedUiText.m_934652dce41d}>
        {pass.instructions.map((instruction) => (<Text key={instruction} style={styles.instruction}>{instruction}</Text>))}
      </DetailCard>
      <DetailCard title={localizedUiText.m_ff8059dc6752}>
        <AppButton title={localizedUiText.m_e693c13fe3de} onPress={handleShare} variant="secondary"/>
        <AppButton title={localizedUiText.m_40bb6fd8547e} onPress={handleCancel} loading={cancelPass.isSubmitting} disabled={!canModify} variant="ghost"/>
        <AppButton title={localizedUiText.m_e68e8be3b6fe} onPress={handleExtend} loading={extendPass.isSubmitting} disabled={!canModify} variant="ghost"/>
      </DetailCard>
    </ParkingScreen>);
}

