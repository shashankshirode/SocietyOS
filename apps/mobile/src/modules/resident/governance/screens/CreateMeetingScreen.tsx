import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { useRepositoryMutation } from "../../../../core/repositories/useRepositoryResult";
import { governanceRepository } from "../data/governance.repository";
import type { CreateMeetingScreenProps } from "../../../../app/navigation/navigation.types";
import type { CreateGovernanceMeetingInput } from "../data/governance.contracts";
import type { MeetingType } from "../../../../shared/types/meeting.types";
import { styles } from "../styles/screens/CreateMeetingScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
const MEETING_TYPES: MeetingType[] = ['AGM', 'SGM', 'COMMITTEE_MEETING', 'RESIDENT_MEETING'];
export function CreateMeetingScreen({ navigation }: CreateMeetingScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [meetingType, setMeetingType] = useState<MeetingType>('AGM');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [venue, setVenue] = useState('');
    const [quorum, setQuorum] = useState('51');
    const { submit, isSubmitting } = useRepositoryMutation((input: CreateGovernanceMeetingInput) => governanceRepository.createMeeting(input));
    const handleCreate = async () => {
        if (!title.trim() || !scheduledDate.trim() || !scheduledTime.trim() || !venue.trim()) {
            AppAlert.alert(String(localizedUiText.m_68e1ca575295), String(localizedUiText.m_d1641a4df419));
            return;
        }
        const result = await submit({ title, description, meetingType, scheduledDate, scheduledTime, venue, quorumRequired: parseInt(quorum, 10) || 51 });
        if (result.ok) {
            AppAlert.alert(String(localizedUiText.m_b58aa37f3c9a), String(localizedUiText.m_5b8656ee29be), [{ text: String(localizedUiText.m_565339bc4d33), onPress: navigation.goBack }]);
        }
    };
    return (<SafeAreaView style={styles.safe} edges={[]}>
      <View style={styles.header}>
        <Pressable onPress={navigation.goBack} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
        </Pressable>
        <Text style={styles.headerTitle}>{localizedUiText.m_05ec51b2c43a}</Text>
        <View style={styles.viewWidth}/>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppCard>
          <Text style={styles.label}>{localizedUiText.m_55ddf8c8a11f}</Text>
          <View style={styles.typeRow}>
            {MEETING_TYPES.map((t) => (<Pressable key={t} style={[styles.typeChip, meetingType === t && styles.typeChipActive]} onPress={() => setMeetingType(t)}>
                <Text style={[styles.typeText, meetingType === t && styles.typeTextActive]}>{t}</Text>
              </Pressable>))}
          </View>

          <Text style={styles.label}>{localizedUiText.m_4bf07d033e69}</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder={localizedUiText.m_0355b9e22961} placeholderTextColor={Colors.textTertiary}/>

          <Text style={styles.label}>{localizedUiText.m_526e0087cc3f}</Text>
          <TextInput style={[styles.input, styles.inputMultiline]} value={description} onChangeText={setDescription} multiline numberOfLines={4} placeholder={localizedUiText.m_a38ee70571d5} placeholderTextColor={Colors.textTertiary}/>

          <Text style={styles.label}>{localizedUiText.m_238f7cd717af}</Text>
          <TextInput style={styles.input} value={scheduledDate} onChangeText={setScheduledDate} placeholder="2026-07-15" placeholderTextColor={Colors.textTertiary}/>

          <Text style={styles.label}>{localizedUiText.m_f255eef12c72}</Text>
          <TextInput style={styles.input} value={scheduledTime} onChangeText={setScheduledTime} placeholder={localizedUiText.m_48ae3f036fa1} placeholderTextColor={Colors.textTertiary}/>

          <Text style={styles.label}>{localizedUiText.m_f3d50cace7a8}</Text>
          <TextInput style={styles.input} value={venue} onChangeText={setVenue} placeholder={localizedUiText.m_52f2868bf671} placeholderTextColor={Colors.textTertiary}/>

          <Text style={styles.label}>{localizedUiText.m_54a2407b98ef}</Text>
          <TextInput style={styles.input} value={quorum} onChangeText={setQuorum} keyboardType="numeric" placeholder="51" placeholderTextColor={Colors.textTertiary}/>
        </AppCard>

        <Pressable style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]} onPress={handleCreate} disabled={isSubmitting}>
          <Ionicons name="calendar-outline" size={20} color={Colors.white}/>
          <Text style={styles.submitText}>{isSubmitting ? localizedUiText.m_def70944c9bb : localizedUiText.m_05ec51b2c43a}</Text>
        </Pressable>

        <Text style={styles.disclaimer}>{localizedUiText.m_e00e8c72073d}</Text>
      </ScrollView>
    </SafeAreaView>);
}

