import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { FamilyAccessPermissionPanel } from '../components/FamilyAccessPermissionPanel';
import type { FamilyAccessPermissions } from '../data/residentHousehold.types';
import { useFamilyMembers } from '../hooks/useFamilyMembers';
import { HouseholdEmptyState, HouseholdScreenLayout, PrimaryAction } from './HouseholdScreenLayout';

type Props = NativeStackScreenProps<HomeStackParamList, 'FamilyAccessPermissions'>;

export function FamilyAccessPermissionsScreen({ navigation, route }: Props) {
  const familyMembers = useFamilyMembers();
  const member = familyMembers.data.find((item) => item.id === route.params.familyMemberId);
  const [permissions, setPermissions] = React.useState<FamilyAccessPermissions | null>(null);

  React.useEffect(() => {
    if (member && !permissions) {
      setPermissions(member.permissions);
    }
  }, [member, permissions]);

  if (!member || !permissions) {
    return (
      <HouseholdScreenLayout titleKey="resident.navigation.familyAccessPermissions.title" subtitleKey="resident.navigation.familyAccessPermissions.subtitle">
        <HouseholdEmptyState titleKey="resident.family.emptyTitle" descriptionKey="resident.household.errors.familyMemberMissing" />
      </HouseholdScreenLayout>
    );
  }

  const handleSave = async () => {
    await familyMembers.updateFamilyMemberPermissions(member.id, permissions);
    navigation.replace('FamilyMemberDetail', { familyMemberId: member.id });
  };

  return (
    <HouseholdScreenLayout titleKey="resident.navigation.familyAccessPermissions.title" subtitleKey="resident.navigation.familyAccessPermissions.subtitle">
      <FamilyAccessPermissionPanel value={permissions} onChange={setPermissions} disabledDocumentAccess={member.isMinor} />
      <PrimaryAction labelKey="resident.buttons.save" onPress={handleSave} disabled={familyMembers.isMutating} />
    </HouseholdScreenLayout>
  );
}

export default FamilyAccessPermissionsScreen;

