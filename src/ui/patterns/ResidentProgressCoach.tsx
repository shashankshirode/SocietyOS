import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle2 } from "./styles/ResidentProgressCoach.styles";
export interface ProgressStep {
    title: string;
    description?: string;
    status: 'completed' | 'current' | 'blocked' | 'pending';
}
export interface ResidentProgressCoachProps {
    steps: ProgressStep[];
    instruction?: string;
}
export function ResidentProgressCoach({ steps, instruction }: ResidentProgressCoachProps) {
    const { colors, dark } = useAppTheme();
    const messages = useMessages();
    const getStatusIcon = (status: ProgressStep['status']) => {
        switch (status) {
            case 'completed':
                return <Ionicons name="checkmark-circle" size={20} color="#10B981"/>;
            case 'blocked':
                return <Ionicons name="close-circle" size={20} color="#EF4444"/>;
            case 'pending':
                return <Ionicons name="time" size={20} color="#F59E0B"/>;
            case 'current':
            default:
                return <Ionicons name="play-circle" size={20} color={colors.primary}/>;
        }
    };
    return (<View style={[
            styles.container,
            createViewBackgroundColorBorderColorStyle(dark ? colors.surfaceElevated : colors.surface, colors.border),
        ]} accessibilityLabel={messages.residentAccessibility.progressCoach}>
      <View style={styles.list}>
        {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const icon = getStatusIcon(step.status);
            return (<View key={step.title} style={styles.row}>
              <View style={styles.leftCol}>
                <View style={styles.iconWrap}>{icon}</View>
                {!isLast && (<View style={[
                        styles.connector,
                        createViewBackgroundColorStyle(step.status === 'completed'
                            ? '#10B981'
                            : step.status === 'blocked'
                                ? '#EF4444'
                                : colors.border),
                    ]}/>)}
              </View>

              <View style={styles.rightCol}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle(step.status === 'blocked'
                    ? '#EF4444'
                    : step.status === 'completed'
                        ? colors.textSecondary
                        : colors.textPrimary)}>
                  {step.title}
                </SafeText>
                {step.description && (<SafeText variant="caption" color="muted">
                    {step.description}
                  </SafeText>)}
              </View>
            </View>);
        })}
      </View>

      {instruction && (<View style={[styles.instructionBox, createViewBackgroundColorBorderColorStyle2(dark ? '#1E293B' : '#F8FAFC', colors.border)]}>
          <Ionicons name="bulb-outline" size={16} color={colors.primary}/>
          <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textPrimary)}>
            {instruction}
          </SafeText>
        </View>)}
    </View>);
}

