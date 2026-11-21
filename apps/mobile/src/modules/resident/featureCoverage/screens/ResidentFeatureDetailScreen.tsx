import { ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { residentFeatureRegistry } from "../data/residentFeatureRegistry";
import { styles, createTextColorStyle, createTextColorStyle2, createViewBackgroundColorStyle, createTextColorStyle3, createScrollViewBackgroundColorStyle, createTextColorStyle4, createTextColorStyle5 } from "../styles/screens/ResidentFeatureDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type FeatureDetailRoute = {
    key: string;
    name: 'ResidentFeatureDetail';
    params: {
        featureId: string;
    };
};
function DetailGroup({ title, items }: {
    title: string;
    items: string[];
}) {
    const { colors } = useAppTheme();
    return (<View style={styles.group}>
      <Text style={[styles.groupTitle, createTextColorStyle(colors.textPrimary)]}>{title}</Text>
      {items.map((item) => (<Text key={item} style={[styles.item, createTextColorStyle2(colors.textSecondary)]}>
          {item}
        </Text>))}
    </View>);
}
export function ResidentFeatureDetailScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const route = useRoute<FeatureDetailRoute>();
    const feature = residentFeatureRegistry.find((item) => item.id === route.params.featureId);
    if (!feature) {
        return (<View style={[styles.container, createViewBackgroundColorStyle(colors.background)]}>
        <Text style={[styles.title, createTextColorStyle3(colors.textPrimary)]}>{localizedUiText.m_049c1a770ef8}</Text>
      </View>);
    }
    return (<ScrollView style={[styles.container, createScrollViewBackgroundColorStyle(colors.background)]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, createTextColorStyle4(colors.textPrimary)]}>{feature.titleMessageKey}</Text>
      <Text style={[styles.status, createTextColorStyle5(colors.textSecondary)]}>
        {feature.status} · {feature.phase}
      </Text>
      <DetailGroup title={localizedUiText.m_2c5b669bcdeb} items={feature.routeNames}/>
      <DetailGroup title={localizedUiText.m_4727a1a2b79c} items={feature.screenNames}/>
      <DetailGroup title={localizedUiText.m_d412a062620e} items={feature.hookNames}/>
      <DetailGroup title={localizedUiText.m_f06919756c7f} items={feature.repositoryMethods}/>
      <DetailGroup title={localizedUiText.m_33a9a926b6c1} items={feature.mockDataKeys}/>
      <DetailGroup title={localizedUiText.m_ff8059dc6752} items={feature.requiredActions}/>
      <DetailGroup title={localizedUiText.m_e5c9d7030bad} items={feature.testNames}/>
    </ScrollView>);
}
export default ResidentFeatureDetailScreen;

