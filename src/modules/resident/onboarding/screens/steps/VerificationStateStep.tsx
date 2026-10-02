import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingShell } from '../../components/OnboardingShell';
import { VerificationStatus } from '../../components/VerificationStatus';
import { PrimaryCTA } from '../../components/PrimaryCTA';
import { SecondaryCTA } from '../../components/SecondaryCTA';
import { ResidentOnboardingDraft, VerificationOutcome, } from '../../data/residentOnboarding.types';
import { FONT_FAMILY_INTER, FONT_FAMILY_INTER_MEDIUM, FONT_FAMILY_INTER_BOLD, FONT_FAMILY_SERIF, } from '../../../../../shared/theme/typography';
interface VerificationStateStepProps {
    draft?: ResidentOnboardingDraft;
    isChecking: boolean;
    outcome: VerificationOutcome;
    onProceedToPermissions: () => void;
    onContinueToHomeLimited: () => void;
    onUpdateDetails: () => void;
    onHelp: () => void;
}
export function VerificationStateStep({ draft, isChecking, outcome, onProceedToPermissions, onContinueToHomeLimited, onUpdateDetails, onHelp, }: VerificationStateStepProps) {
    const societyName = draft?.selectedSociety?.name || 'Green Valley Heights';
    const unitLabel = draft?.selectedUnit
        ? `${draft.selectedUnit.unitNumber} • ${draft.selectedUnit.tower}`
        : 'A-1204 • Tower A';
    if (isChecking) {
        return (<OnboardingShell currentMilestone="Ready" currentStepIndex={5} showBack={false} onHelp={onHelp}>
        <View style={styles.container}>
          <View style={styles.headerBlock}>
            <Text style={styles.heading}>We're checking your details</Text>
            <Text style={styles.supportingText}>
              Your society team is reviewing your registration.
            </Text>
          </View>

          <VerificationStatus />
        </View>
      </OnboardingShell>);
    }
    if (outcome === 'APPROVED') {
        return (<OnboardingShell currentMilestone="Ready" currentStepIndex={5} showBack={false} onHelp={onHelp} footerCta={<PrimaryCTA label="Continue" onPress={onProceedToPermissions}/>}>
        <View style={styles.container}>
          <View style={styles.iconCircleApproved}>
            <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
              <Path d="m5 12 5 5L20 7" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </View>

          <View style={styles.headerBlockCentered}>
            <Text style={styles.heading}>You're all set.</Text>
            <Text style={styles.supportingText}>
              Your home in {societyName} is verified and ready.
            </Text>
          </View>

          
          <View style={styles.verifiedCard}>
            <View style={styles.unitCol}>
              <Text style={styles.verifiedUnitText}>{unitLabel}</Text>
              <Text style={styles.verifiedSocietyText}>{societyName}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Verified</Text>
            </View>
          </View>
        </View>
      </OnboardingShell>);
    }
    if (outcome === 'PENDING') {
        return (<OnboardingShell currentMilestone="Ready" currentStepIndex={5} showBack={false} onHelp={onHelp} footerCta={<PrimaryCTA label="Continue to Home" onPress={onContinueToHomeLimited}/>}>
        <View style={styles.container}>
          <View style={styles.iconCirclePending}>
            <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
              <Path d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke="#064F45" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </View>

          <View style={styles.headerBlockCentered}>
            <Text style={styles.heading}>Your request is with the society team</Text>
            <Text style={styles.supportingText}>
              We'll notify you as soon as your registration is approved.
            </Text>
          </View>

          
          <View style={styles.timelineBox}>
            <View style={styles.timelineRow}>
              <View style={[styles.timelineNode, styles.timelineNodeDone]}>
                <Text style={styles.timelineCheck}>✓</Text>
              </View>
              <View style={styles.timelineTextCol}>
                <Text style={styles.timelineTitleDone}>Submitted</Text>
                <Text style={styles.timelineDesc}>Registration & documents received</Text>
              </View>
            </View>

            <View style={styles.timelineConnector}/>

            <View style={styles.timelineRow}>
              <View style={[styles.timelineNode, styles.timelineNodeActive]}>
                <Text style={styles.timelineActiveDot}>●</Text>
              </View>
              <View style={styles.timelineTextCol}>
                <Text style={styles.timelineTitleActive}>Under review</Text>
                <Text style={styles.timelineDesc}>Society management checking details</Text>
              </View>
            </View>

            <View style={styles.timelineConnector}/>

            <View style={styles.timelineRow}>
              <View style={[styles.timelineNode, styles.timelineNodePending]}>
                <Text style={styles.timelinePendingDot}>○</Text>
              </View>
              <View style={styles.timelineTextCol}>
                <Text style={styles.timelineTitlePending}>Activation</Text>
                <Text style={styles.timelineDesc}>Full resident permissions enabled</Text>
              </View>
            </View>
          </View>
        </View>
      </OnboardingShell>);
    }
    return (<OnboardingShell currentMilestone="Review" currentStepIndex={4} showBack={false} onHelp={onHelp} footerCta={<PrimaryCTA label="Update details" onPress={onUpdateDetails}/>}>
      <View style={styles.container}>
        <View style={styles.iconCircleAction}>
          <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <Path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#D9534F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        </View>

        <View style={styles.headerBlockCentered}>
          <Text style={styles.heading}>A little more information is needed</Text>
          <Text style={styles.supportingText}>
            The society team has requested an update to your registration.
          </Text>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.actionCardTitle}>Rental agreement</Text>
          <Text style={styles.actionCardDesc}>
            The uploaded agreement was illegible. Please upload a clear copy of the registered leave & license agreement.
          </Text>
        </View>
      </View>
    </OnboardingShell>);
}
const styles = StyleSheet.create({
    container: {
        gap: 20,
        paddingTop: 16,
        alignItems: 'center',
    },
    headerBlock: {
        gap: 6,
        width: '100%',
    },
    headerBlockCentered: {
        gap: 6,
        alignItems: 'center',
    },
    heading: {
        fontSize: 26,
        fontFamily: FONT_FAMILY_SERIF,
        fontWeight: '600',
        color: '#10201D',
        textAlign: 'center',
    },
    supportingText: {
        fontSize: 14.5,
        fontFamily: FONT_FAMILY_INTER,
        color: '#69716D',
        textAlign: 'center',
        lineHeight: 21,
    },
    iconCircleApproved: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#064F45',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#064F45',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    iconCirclePending: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#E6F0EE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircleAction: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#FFEBEE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifiedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#CEE1DC',
        padding: 18,
        marginTop: 8,
    },
    unitCol: {
        gap: 3,
    },
    verifiedUnitText: {
        fontSize: 18,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#10201D',
    },
    verifiedSocietyText: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_INTER,
        color: '#69716D',
    },
    statusPill: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
    },
    statusPillText: {
        fontSize: 12.5,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#1B7A4E',
    },
    timelineBox: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EBE8DE',
        padding: 20,
        marginTop: 6,
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
    },
    timelineNode: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineNodeDone: {
        backgroundColor: '#064F45',
    },
    timelineNodeActive: {
        backgroundColor: '#E6F0EE',
        borderWidth: 1.5,
        borderColor: '#064F45',
    },
    timelineNodePending: {
        backgroundColor: '#F5F2EA',
    },
    timelineCheck: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    timelineActiveDot: {
        color: '#064F45',
        fontSize: 12,
    },
    timelinePendingDot: {
        color: '#A0A5A2',
        fontSize: 12,
    },
    timelineTextCol: {
        flex: 1,
        gap: 2,
    },
    timelineTitleDone: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#10201D',
    },
    timelineTitleActive: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#064F45',
    },
    timelineTitlePending: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_INTER_MEDIUM,
        color: '#7C8581',
    },
    timelineDesc: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_INTER,
        color: '#69716D',
    },
    timelineConnector: {
        width: 2,
        height: 22,
        backgroundColor: '#EBE8DE',
        marginLeft: 12,
        marginVertical: 2,
    },
    actionCard: {
        width: '100%',
        backgroundColor: '#FFEBEE',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FFCDD2',
        padding: 16,
        gap: 6,
        marginTop: 6,
    },
    actionCardTitle: {
        fontSize: 14.5,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#D9534F',
    },
    actionCardDesc: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_INTER,
        color: '#55605C',
        lineHeight: 18,
    },
});

