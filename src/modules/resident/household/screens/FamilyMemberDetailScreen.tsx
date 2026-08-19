import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { StatusBadge } from '../../../../shared/components/StatusBadge';
import { useFamilyMembers } from '../hooks/useFamilyMembers';
import { HouseholdEmptyState, HouseholdScreenLayout, SectionCard, useHouseholdMessages } from './HouseholdScreenLayout';

type Props = NativeStackScreenProps<HomeStackParamList, 'FamilyMemberDetail'>;

export function FamilyMemberDetailScreen({ navigation, route }: Props) {
  const { data } = useFamilyMembers();
  const { text } = useHouseholdMessages();
  const member = data.find((item) => item.id === route.params.familyMemberId);

  if (!member) {
    return (
      <HouseholdScreenLayout titleKey="resident.navigation.familyMemberDetail.title" subtitleKey="resident.navigation.familyMemberDetail.subtitle">
        <HouseholdEmptyState titleKey="resident.family.emptyTitle" descriptionKey="resident.household.errors.familyMemberMissing" />
      </HouseholdScreenLayout>
    );
  }

  return (
    <HouseholdScreenLayout titleKey="resident.navigation.familyMemberDetail.title" subtitleKey="resident.navigation.familyMemberDetail.subtitle">
      <SectionCard>
        <SafeText variant="h3" color="primary">{member.fullName}</SafeText>
        <SafeText variant="caption" color="secondary">{text(`resident.family.relations.${member.relationToOwner}`)}</SafeText>
        <SafeText variant="caption" color="muted">{member.phoneNumber || text('resident.family.fields.phoneNotLinked')}</SafeText>
        <StatusBadge label={text(`resident.family.accessStatus.${member.accessStatus}`)} type={member.accessStatus === 'ACTIVE' ? 'success' : 'warning'} />
      </SectionCard>
      <SectionCard>
        <SafeText variant="bodyStrong" color="primary">{text('resident.family.permissions.title')}</SafeText>
        <SafeText variant="caption" color="secondary">{text(member.permissions.visitorApprovalPermission ? 'resident.family.permissions.visitorApproval' : 'resident.family.permissions.noVisitorApproval')}</SafeText>
        <SafeText variant="caption" color="secondary">{text(`resident.family.documentAccess.${member.permissions.documentAccessPermission}`)}</SafeText>
      </SectionCard>
      <AppButton title={text('resident.buttons.edit')} onPress={() => navigation.navigate('EditFamilyMember', { familyMemberId: member.id })} />
      <AppButton title={text('resident.household.profile.actions.manageFamilyAccess')} variant="secondary" onPress={() => navigation.navigate('FamilyAccessPermissions', { familyMemberId: member.id })} />
    </HouseholdScreenLayout>
  );
}

export default FamilyMemberDetailScreen;

