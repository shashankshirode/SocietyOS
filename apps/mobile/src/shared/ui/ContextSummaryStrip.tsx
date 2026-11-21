import React from "react";
import { View } from "react-native";
import { SafeText } from "../typography/SafeText";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "./styles/ContextSummaryStrip.styles";
interface ContextSummaryStripProps {
    items: string[];
}
export function ContextSummaryStrip({ items }: ContextSummaryStripProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.strip, createViewBackgroundColorBorderColorStyle(colors.backgroundSoft, colors.border)]}>
      {items.map((item, index) => (<React.Fragment key={index}>
          {index > 0 && <View style={[styles.dot, createViewBackgroundColorStyle(colors.textMuted)]}/>}
          <SafeText variant="caption" color="secondary" style={styles.text}>
            {item}
          </SafeText>
        </React.Fragment>))}
    </View>);
}

