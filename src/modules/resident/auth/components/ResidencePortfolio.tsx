import { useState } from "react";
import { FlatList, View, useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useResponsiveLayout } from "../../../../shared/layout/useResponsiveLayout";
import { Spacing } from "../../../../shared/theme/spacing";
import { ResidenceAccessTile } from "./ResidenceAccessTile";
import type { ResidenceMembership } from "../data/membership.types";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createViewWidthStyle, createViewBackgroundColorWidthStyle } from "../styles/components/ResidencePortfolio.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface ResidencePortfolioProps {
    memberships: readonly ResidenceMembership[];
    onSelectActive: (membership: ResidenceMembership) => void;
    onSelectPending?: (membership: ResidenceMembership) => void;
    onActionPress?: (membership: ResidenceMembership, action: string) => void;
}
export function ResidencePortfolio({ memberships, onSelectActive, onSelectPending, onActionPress, }: ResidencePortfolioProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { isTablet } = useResponsiveLayout();
    const { width: screenWidth } = useWindowDimensions();
    const [activeIndex, setActiveIndex] = useState(0);
    const activeMemberships = memberships.filter((m) => m.status === 'active');
    const otherMemberships = memberships.filter((m) => m.status !== 'active');
    const cardWidth = screenWidth - 48;
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        if (roundIndex !== activeIndex) {
            setActiveIndex(roundIndex);
        }
    };
    const handleTilePress = (membership: ResidenceMembership) => {
        if (membership.status === 'active') {
            onSelectActive(membership);
        }
        else if (onSelectPending) {
            onSelectPending(membership);
        }
    };
    if (isTablet) {
        return (<View style={styles.tabletGrid}>
        
        {activeMemberships.length > 0 && (<View style={styles.gridSection}>
            <AppText variant="sectionTitle" style={styles.sectionHeader}>{localizedUiText.m_6a04b17a8e3d}</AppText>
            <View style={styles.gridContainer}>
              {activeMemberships.map((item) => (<View key={item.membershipId} style={styles.gridCell}>
                  <ResidenceAccessTile membership={item} onPress={handleTilePress} {...includeWhenPresent("onActionPress", onActionPress)}/>
                </View>))}
            </View>
          </View>)}

        
        {otherMemberships.length > 0 && (<View style={styles.otherSection}>
            <AppText variant="sectionTitle" style={styles.sectionHeader}>{localizedUiText.m_93e0807015ed}</AppText>
            <View style={styles.verticalList}>
              {otherMemberships.map((item) => (<ResidenceAccessTile key={item.membershipId} membership={item} onPress={handleTilePress} {...includeWhenPresent("onActionPress", onActionPress)}/>))}
            </View>
          </View>)}
      </View>);
    }
    return (<View style={styles.phoneLayout}>
      
      {activeMemberships.length > 0 && (<View style={styles.carouselSection}>
          <FlatList data={activeMemberships} keyExtractor={(item) => item.membershipId} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={200} snapToInterval={cardWidth + Spacing.md} decelerationRate="fast" contentContainerStyle={styles.carouselContainer} renderItem={({ item }) => (<View style={[styles.carouselCard, createViewWidthStyle(cardWidth)]}>
                <ResidenceAccessTile membership={item} onPress={handleTilePress} {...includeWhenPresent("onActionPress", onActionPress)}/>
              </View>)}/>
          {activeMemberships.length > 1 && (<View style={styles.indicatorRow}>
              {activeMemberships.map((_, i) => (<View key={i} style={[
                        styles.dot,
                        createViewBackgroundColorWidthStyle(i === activeIndex ? colors.primary : colors.border, i === activeIndex ? 16 : 6),
                    ]}/>))}
            </View>)}
        </View>)}

      
      {otherMemberships.length > 0 && (<View style={styles.otherSection}>
          <AppText variant="sectionTitle" style={styles.sectionHeader}>{localizedUiText.m_839973464e9f}</AppText>
          <View style={styles.verticalList}>
            {otherMemberships.map((item) => (<ResidenceAccessTile key={item.membershipId} membership={item} onPress={handleTilePress} {...includeWhenPresent("onActionPress", onActionPress)}/>))}
          </View>
        </View>)}
    </View>);
}

