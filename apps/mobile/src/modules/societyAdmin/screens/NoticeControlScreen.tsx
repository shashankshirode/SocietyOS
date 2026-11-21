import { useState } from "react";
import { FlatList, Text, View, ActivityIndicator, ScrollView } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { FormField } from "../../../shared/forms/FormField";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useAdminNotices } from "../data/useAdminNotices";
import { adminRepository } from "../data/admin.repository";
import { validateNotice } from "../validators/societyAdmin.validators";
import type { AdminNotice, AdminNoticeTarget } from "../../../shared/types/admin.types";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/NoticeControlScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function NoticeControlScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: notices = [], isLoading, error, refetch } = useAdminNotices();
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('General');
    const [target, setTarget] = useState('ALL_RESIDENTS');
    const [errors, setErrors] = useState<{
        title?: string;
        content?: string;
    }>({});
    const handlePublish = () => {
        const validation = validateNotice(title, content);
        if (!validation.isValid) {
            setErrors(validation.fieldErrors);
            return;
        }
        setErrors({});
        AppAlert.alert(String(localizedUiText.m_1c072121e16f), String(localizedUiText.m_c04dbb92a2ee), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_859390eb495b),
                onPress: async () => {
                    try {
                        await adminRepository.createNotice({
                            title,
                            content,
                            category,
                            target: target as AdminNoticeTarget
                        });
                        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_1c63dd2f6ca3));
                        setIsCreating(false);
                        setTitle('');
                        setContent('');
                        refetch();
                    }
                    catch {
                        AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_849cc8888b1e));
                    }
                }
            },
        ]);
    };
    const renderNoticeItem = ({ item, index }: {
        item: AdminNotice;
        index: number;
    }) => (<Animated.View entering={FadeInLeft.delay(index * 30).duration(300)}>
      <AppCard style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.category}>{item.category}</Text>
          <StatusBadge label={item.status} type={item.status === 'PUBLISHED' ? 'success' : 'neutral'}/>
        </View>
        <Text style={styles.noticeTitle}>{item.title}</Text>
        <Text style={styles.noticeContent} numberOfLines={3}>{item.content}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{localizedUiText.m_890d34fffcde + " "}{item.target.replace('_', ' ')}</Text>
          <Text style={styles.metaText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </AppCard>
    </Animated.View>);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={isCreating ? localizedUiText.m_d22bc4a5295e : localizedUiText.m_146571777627} showBack onBack={isCreating ? () => setIsCreating(false) : navigation.goBack}/>

      {isCreating ? (<ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
          <FormField label={localizedUiText.m_9193f0176de0} required value={title} onChangeText={setTitle} placeholder={localizedUiText.m_b683410a36c5} {...includeWhenPresent("error", errors.title)}/>
          
          <FormField label={localizedUiText.m_397843312c5a} required value={category} onChangeText={setCategory} placeholder={localizedUiText.m_e6cf3d395901}/>

          <FormField label={localizedUiText.m_6fac1c5c8705} required value={target} onChangeText={setTarget} placeholder={localizedUiText.m_739d730731be}/>

          <FormField label={localizedUiText.m_6071c60465eb} required value={content} onChangeText={setContent} placeholder={localizedUiText.m_ac091cb8b880} multiline numberOfLines={6} {...includeWhenPresent("error", errors.content)}/>

          <View style={styles.buttonRow}>
            <AppButton title={localizedUiText.m_19766ed6ccb2} variant="secondary" onPress={() => setIsCreating(false)} style={styles.appButtonFlex}/>
            <AppButton title={localizedUiText.m_1c072121e16f} variant="primary" onPress={handlePublish} style={styles.appButtonFlex2}/>
          </View>
        </ScrollView>) : (<View style={styles.viewFlex}>
          <View style={styles.topActions}>
            <AppButton title={localizedUiText.m_bc2fb0acc837} variant="primary" onPress={() => setIsCreating(true)}/>
          </View>

          {isLoading ? (<View style={styles.centered}>
              <ActivityIndicator size="large" color={Colors.primary}/>
            </View>) : error ? (<EmptyState title={localizedUiText.m_34c64a0eadde} description={error.message} iconName="alert-circle-outline"/>) : notices.length === 0 ? (<EmptyState title={localizedUiText.m_d6636218a7ba} description={localizedUiText.m_51b7afdb39d9} iconName="megaphone-outline"/>) : (<FlatList data={notices} renderItem={renderNoticeItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>)}
        </View>)}
    </SafeAreaView>);
}

