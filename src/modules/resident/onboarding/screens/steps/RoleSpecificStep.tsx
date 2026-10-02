import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingShell } from '../../components/OnboardingShell';
import { ProfileField } from '../../components/ProfileField';
import { PrimaryCTA } from '../../components/PrimaryCTA';
import { ResidentRole, FamilyRelation } from '../../data/residentOnboarding.types';
import type { ClaimedRelationshipType } from '../../../auth/data/registration.types';
import type { TenantDetails, FamilyDetails } from '../../hooks/useResidentOnboarding';
import { FONT_FAMILY_INTER, FONT_FAMILY_INTER_MEDIUM, FONT_FAMILY_INTER_BOLD, FONT_FAMILY_SERIF, } from '../../../../../shared/theme/typography';
interface RoleSpecificStepProps {
    role: ResidentRole | ClaimedRelationshipType;
    onSubmit: (details: {
        tenantDetails?: TenantDetails;
        familyDetails?: FamilyDetails;
    }) => void;
    onBack: () => void;
    onHelp: () => void;
}
const FAMILY_RELATIONS: FamilyRelation[] = [
    'Spouse',
    'Parent',
    'Child',
    'Sibling',
    'Other',
];

const RELATION_MAP: Record<FamilyRelation, FamilyDetails['relationship']> = {
    Spouse: 'SPOUSE',
    Child: 'CHILD',
    Parent: 'PARENT',
    Sibling: 'OTHER',
    Other: 'OTHER',
};

export function RoleSpecificStep({ role, onSubmit, onBack, onHelp, }: RoleSpecificStepProps) {
    const [agreementStart, setAgreementStart] = useState('01/10/2026');
    const [agreementEnd, setAgreementEnd] = useState('30/09/2027');
    const [ownerName, setOwnerName] = useState('Deepak Singhania');
    const [selectedRelation, setSelectedRelation] = useState<FamilyRelation>('Spouse');
    const [primaryResidentName, setPrimaryResidentName] = useState('Shashank Shirode');
    const handleContinue = () => {
        if (role === 'TENANT') {
            onSubmit({
                tenantDetails: {
                    agreementStart,
                    agreementEnd,
                    requiresOwnerVerification: true,
                    ownerName,
                },
            });
        }
        else if (role === 'FAMILY_MEMBER') {
            onSubmit({
                familyDetails: {
                    relationship: RELATION_MAP[selectedRelation] || 'OTHER',
                    primaryResidentName,
                },
            });
        }
        else {
            onSubmit({});
        }
    };
    return (<OnboardingShell currentMilestone="About you" currentStepIndex={3} onBack={onBack} onHelp={onHelp} footerCta={<PrimaryCTA label="Continue to profile" onPress={handleContinue}/>}>
      <View style={styles.container}>
        {role === 'TENANT' ? (<>
            <View style={styles.headerBlock}>
              <Text style={styles.heading}>Tenancy details</Text>
              <Text style={styles.supportingText}>
                Provide your agreement duration for resident record compliance.
              </Text>
            </View>

            
            <View style={styles.infoNoticeBox}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ marginTop: 2 }}>
                <Path d="M12 9v4m0 4h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#064F45" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
              <View style={styles.infoNoticeTextCol}>
                <Text style={styles.infoNoticeTitle}>Waiting for owner verification</Text>
                <Text style={styles.infoNoticeBody}>
                  Your society requires owner verification before your resident access can be activated.
                </Text>
              </View>
            </View>

            <View style={styles.fieldsGroup}>
              <ProfileField label="Agreement start date" value={agreementStart} onChangeText={setAgreementStart} placeholder="DD/MM/YYYY"/>
              <ProfileField label="Agreement end date" value={agreementEnd} onChangeText={setAgreementEnd} placeholder="DD/MM/YYYY"/>
              <ProfileField label="Flat owner name (as on agreement)" value={ownerName} onChangeText={setOwnerName} placeholder="Owner full name" helperText="We will notify the owner for digital consent."/>
            </View>
          </>) : role === 'FAMILY_MEMBER' ? (<>
            <View style={styles.headerBlock}>
              <Text style={styles.heading}>Relationship to household</Text>
              <Text style={styles.supportingText}>
                Select how you are related to the primary resident.
              </Text>
            </View>

            
            <View style={styles.relationGrid}>
              {FAMILY_RELATIONS.map((rel) => {
                const isSelected = selectedRelation === rel;
                return (<Pressable key={rel} onPress={() => setSelectedRelation(rel)} style={[
                        styles.relationChip,
                        isSelected && styles.relationChipSelected,
                    ]}>
                    <Text style={[
                        styles.relationChipText,
                        isSelected && styles.relationChipTextSelected,
                    ]}>
                      {rel}
                    </Text>
                  </Pressable>);
            })}
            </View>

            <View style={styles.fieldsGroup}>
              <ProfileField label="Primary resident / homeowner name" value={primaryResidentName} onChangeText={setPrimaryResidentName} placeholder="Name of primary household member" helperText="Your association will be verified with the primary account holder."/>
            </View>
          </>) : (<>
            <View style={styles.headerBlock}>
              <Text style={styles.heading}>Resident authorization</Text>
              <Text style={styles.supportingText}>
                Authorized designee or caretaker record.
              </Text>
            </View>
            <View style={styles.fieldsGroup}>
              <ProfileField label="Authorizing resident / landlord" value="Deepak Singhania" placeholder="Full name of authorizing resident"/>
            </View>
          </>)}
      </View>
    </OnboardingShell>);
}
const styles = StyleSheet.create({
    container: {
        gap: 18,
        paddingTop: 8,
    },
    headerBlock: {
        gap: 6,
    },
    heading: {
        fontSize: 26,
        fontFamily: FONT_FAMILY_SERIF,
        fontWeight: '600',
        color: '#10201D',
    },
    supportingText: {
        fontSize: 14.5,
        fontFamily: FONT_FAMILY_INTER,
        color: '#69716D',
        lineHeight: 20,
    },
    infoNoticeBox: {
        flexDirection: 'row',
        backgroundColor: '#E6F0EE',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#CEE1DC',
        padding: 16,
        gap: 12,
    },
    infoNoticeTextCol: {
        flex: 1,
        gap: 4,
    },
    infoNoticeTitle: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#064F45',
    },
    infoNoticeBody: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_INTER,
        color: '#3D8577',
        lineHeight: 18,
    },
    fieldsGroup: {
        gap: 4,
    },
    relationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginVertical: 6,
    },
    relationChip: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#EBE8DE',
    },
    relationChipSelected: {
        backgroundColor: '#064F45',
        borderColor: '#064F45',
    },
    relationChipText: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_INTER_MEDIUM,
        color: '#10201D',
    },
    relationChipTextSelected: {
        color: '#FFFFFF',
        fontFamily: FONT_FAMILY_INTER_BOLD,
    },
});

