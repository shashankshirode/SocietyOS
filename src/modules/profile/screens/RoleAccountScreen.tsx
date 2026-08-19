import { Text, View } from "react-native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FacilityOpsStackParamList, SocietyAdminStackParamList, TreasurerStackParamList } from "../../../app/navigation/navigation.types";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppScreen } from "../../../shared/layouts/AppScreen";
import { LogoutButton } from "../../../shared/components/LogoutButton";
import { MetricCard } from "../../../shared/cards/MetricCard";
import { SectionHeader } from "../../../shared/components/SectionHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { resetToAppModeSelector } from "../../../core/auth/authNavigation";
import { useAuthSession } from "../../../core/auth/useAuthSession";
import { AccountActionList } from "../components/AccountActionList";
import { ProfileHeaderCard } from "../components/ProfileHeaderCard";
import { AppIconName } from "../../../shared/icons/icon.types";
import { styles, createTextColorStyle, createTextColorStyle2 } from "../styles/screens/RoleAccountScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type RoleAccountKind = 'admin' | 'treasurer' | 'facility';
type RoleAccountConfig = {
    title: string;
    fallbackName: string;
    roleLabel: string;
    subtitle: string;
    meta: string;
    metrics: {
        label: string;
        value: string | number;
        helperText?: string;
        tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    }[];
    actions: {
        label: string;
        description: string;
        iconName: AppIconName;
    }[];
};
const roleAccountConfigs: Record<RoleAccountKind, RoleAccountConfig> = {
    admin: {
        get title() {
            return getActiveUiLiteral("m_fe0c27ce0fe8");
        },
        fallbackName: 'Neha Kulkarni',
        roleLabel: 'Society Admin',
        get subtitle() {
            return getActiveUiLiteral("m_edde8ac83581");
        },
        meta: getActiveUiLiteral("m_d41733331f45"),
        metrics: [
            { get label() {
                    return getActiveUiLiteral("m_0405f4b67edd");
                }, value: 4, tone: 'warning' },
            { get label() {
                    return getActiveUiLiteral("m_ebde62662b77");
                }, value: 9, tone: 'danger' },
            { get label() {
                    return getActiveUiLiteral("m_cc672a8a17a0");
                }, value: 18, tone: 'info' },
        ],
        actions: [
            {
                get label() {
                    return getActiveUiLiteral("m_d97c3089d453");
                },
                get description() {
                    return getActiveUiLiteral("m_4543885e2c72");
                },
                iconName: 'settings',
            },
            {
                get label() {
                    return getActiveUiLiteral("m_22e198dfc390");
                },
                get description() {
                    return getActiveUiLiteral("m_06b9a68f1058");
                },
                iconName: 'audit',
            },
            {
                get label() {
                    return getActiveUiLiteral("m_be91940b79f4");
                },
                get description() {
                    return getActiveUiLiteral("m_e688b581cce2");
                },
                iconName: 'info',
            },
        ],
    },
    treasurer: {
        get title() {
            return getActiveUiLiteral("m_c7afef74e41d");
        },
        fallbackName: 'Rohan Deshpande',
        roleLabel: 'Treasurer',
        get subtitle() {
            return getActiveUiLiteral("m_edde8ac83581");
        },
        meta: getActiveUiLiteral("m_d56d948f5fc8"),
        metrics: [
            { get label() {
                    return getActiveUiLiteral("m_32cc836f4200");
                }, value: '2026-27', tone: 'primary' },
            { get label() {
                    return getActiveUiLiteral("m_279c833305fb");
                }, value: 3, tone: 'warning' },
            { get label() {
                    return getActiveUiLiteral("m_138dadad1829");
                }, value: 12, tone: 'success' },
        ],
        actions: [
            {
                get label() {
                    return getActiveUiLiteral("m_01c573496619");
                },
                get description() {
                    return getActiveUiLiteral("m_82775ae5419c");
                },
                iconName: 'shield',
            },
            {
                get label() {
                    return getActiveUiLiteral("m_82daeef4f870");
                },
                get description() {
                    return getActiveUiLiteral("m_700201408e47");
                },
                iconName: 'receipt',
            },
            {
                get label() {
                    return getActiveUiLiteral("m_be91940b79f4");
                },
                get description() {
                    return getActiveUiLiteral("m_17f278c2c229");
                },
                iconName: 'info',
            },
        ],
    },
    facility: {
        get title() {
            return getActiveUiLiteral("m_f51c48b2b20e");
        },
        fallbackName: 'Kavita Nair',
        roleLabel: 'Facility Manager',
        get subtitle() {
            return getActiveUiLiteral("m_edde8ac83581");
        },
        meta: getActiveUiLiteral("m_e58f65d0d1c5"),
        metrics: [
            { get label() {
                    return getActiveUiLiteral("m_f91267fc8325");
                }, value: 14, tone: 'warning' },
            { get label() {
                    return getActiveUiLiteral("m_0c35c0fc1728");
                }, value: 42, tone: 'success' },
            { get label() {
                    return getActiveUiLiteral("m_709b89c9c2e6");
                }, value: 3, tone: 'danger' },
        ],
        actions: [
            {
                get label() {
                    return getActiveUiLiteral("m_92c33cea0480");
                },
                get description() {
                    return getActiveUiLiteral("m_62e9c26b75ed");
                },
                iconName: 'unit',
            },
            {
                get label() {
                    return getActiveUiLiteral("m_a8b7b1fa0456");
                },
                get description() {
                    return getActiveUiLiteral("m_8fa17a20b6f0");
                },
                iconName: 'clock',
            },
            {
                get label() {
                    return getActiveUiLiteral("m_be91940b79f4");
                },
                get description() {
                    return getActiveUiLiteral("m_610747d92700");
                },
                iconName: 'info',
            },
        ],
    },
};
type RoleAccountScreenProps = {
    kind: RoleAccountKind;
    navigation: NavigationProp<ParamListBase>;
};
export function RoleAccountScreen({ kind, navigation }: RoleAccountScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { session, logout } = useAuthSession();
    const config = roleAccountConfigs[kind];
    async function handleLogout() {
        await logout();
        resetToAppModeSelector(navigation);
    }
    return (<AppScreen scroll>
      <AppHeader title={config.title} showBack onBack={() => navigation.goBack()}/>
      <View style={styles.content}>
        <ProfileHeaderCard name={session?.name ?? config.fallbackName} roleLabel={config.roleLabel} subtitle={session?.societyName ?? config.subtitle} meta={config.meta}/>

        <View style={styles.metricGrid}>
          {config.metrics.map((metric) => (<MetricCard key={metric.label} {...metric} style={styles.metricCard}/>))}
        </View>

        <SectionHeader title={localizedUiText.m_1003fb766c8d} style={styles.sectionHeader}/>
        <AccountActionList actions={config.actions.map((action) => ({
            ...action,
            onPress: () => undefined,
        }))}/>

        <AppCard style={styles.securityCard}>
          <Text style={[styles.securityTitle, createTextColorStyle(colors.textPrimary)]}>{localizedUiText.m_6959b4159575}</Text>
          <Text style={[styles.securityText, createTextColorStyle2(colors.textSecondary)]}>{localizedUiText.m_9eee4b40b6b8}</Text>
          <LogoutButton onConfirmLogout={handleLogout}/>
        </AppCard>
      </View>
    </AppScreen>);
}
export function AdminAccountScreen({ navigation, }: NativeStackScreenProps<SocietyAdminStackParamList, 'AdminProfile'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    return <RoleAccountScreen kind="admin" navigation={navigation as NavigationProp<ParamListBase>}/>;
}
export function TreasurerAccountScreen({ navigation, }: NativeStackScreenProps<TreasurerStackParamList, 'TreasurerProfile'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    return <RoleAccountScreen kind="treasurer" navigation={navigation as NavigationProp<ParamListBase>}/>;
}
export function FacilityAccountScreen({ navigation, }: NativeStackScreenProps<FacilityOpsStackParamList, 'FacilityProfile'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    return <RoleAccountScreen kind="facility" navigation={navigation as NavigationProp<ParamListBase>}/>;
}
export default RoleAccountScreen;

