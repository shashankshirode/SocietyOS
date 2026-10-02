import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SocietyService } from '../services/societyService';
import { SocietyForm } from '../components/SocietyForm';
import type { Society } from '../data/societyProperty.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';

type Props = {
  navigation: NativeStackNavigationProp<SuperAdminStackParamList, 'SocietyOnboarding'>;
  route: RouteProp<SuperAdminStackParamList, 'SocietyOnboarding'>;
};

export function SocietyOnboardingScreen({ navigation, route }: Props) {
  const { societyId, mode = 'create' } = route.params || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<Society | null>(null);
  const [isLoading, setIsLoading] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit' && societyId) {
      loadSociety();
    }
  }, [societyId, mode]);

  const loadSociety = async () => {
    setIsLoading(true);
    try {
      const society = await SocietyService.getSociety(societyId!);
      if (society) {
        setInitialData(society);
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to load society');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Society) => {
    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        const newSociety = await SocietyService.createSociety(data as any);
        navigation.navigate('SOCIETY_VALIDATION', { societyId: newSociety.id });
      } else if (societyId) {
        await SocietyService.updateSociety({ ...data, id: societyId } as any);
        navigation.navigate('SOCIETY_VALIDATION', { societyId });
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save society');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SocietyForm
        mode={mode}
        onSubmit={async () => {}}
        onCancel={async () => { navigation.goBack(); }}
        isSubmitting={true}
      />
    );
  }

  return (
    <SocietyForm
      mode={mode}
      initialData={initialData ?? undefined}
      onSubmit={handleSubmit}
      onCancel={async () => { navigation.goBack(); }}
      isSubmitting={isSubmitting}
    />
  );
}