import { Text, View } from "react-native";
import { styles, createTextColorStyle, createTextColorStyle2 } from "./styles/HeaderTitleBlock.styles";
interface HeaderTitleBlockProps {
    title: string;
    subtitle?: string;
    textColor?: string;
    subtitleColor?: string;
}
export function HeaderTitleBlock({ title, subtitle, textColor = '#FFFFFF', subtitleColor = 'rgba(255, 255, 255, 0.75)', }: HeaderTitleBlockProps) {
    return (<View style={styles.container}>
      <Text style={[styles.title, createTextColorStyle(textColor)]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
        {title}
      </Text>
      {subtitle ? (<Text style={[styles.subtitle, createTextColorStyle2(subtitleColor)]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
          {subtitle}
        </Text>) : null}
    </View>);
}

