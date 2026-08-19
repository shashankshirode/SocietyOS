import React from "react";
import { View } from "react-native";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ResidenceMembershipStatus } from "../data/membership.types";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createAppTextColorStyle } from "../styles/components/MembershipProgressPanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface MembershipProgressPanelProps {
    status: ResidenceMembershipStatus;
}
export function MembershipProgressPanel({ status }: MembershipProgressPanelProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const stages = [
        { label: String(localizedUiText.m_155f816c0407), done: true },
        { label: String(localizedUiText.m_eea2745e2867), done: true },
        { label: String(localizedUiText.m_aff0766a5290), done: status !== 'profileIncomplete' && status !== 'documentsRequired' },
        { label: String(localizedUiText.m_6007acbe30b2), done: status === 'active' },
    ];
    return (<View style={styles.container}>
      <View style={styles.lineRow}>
        {stages.map((stage, i) => {
            const isLast = i === stages.length - 1;
            const circleColor = stage.done ? colors.success : colors.border;
            const lineColor = stage.done && !isLast ? colors.success : colors.border;
            return (<React.Fragment key={i}>
              <View style={[styles.circle, createViewBackgroundColorStyle(circleColor)]}/>
              {!isLast && <View style={[styles.line, createViewBackgroundColorStyle2(lineColor)]}/>}
            </React.Fragment>);
        })}
      </View>
      <View style={styles.labelsRow}>
        {stages.map((stage, i) => (<AppText key={i} variant="caption" style={[styles.label, createAppTextColorStyle(colors.textSecondary)]}>
            {stage.label}
          </AppText>))}
      </View>
    </View>);
}

