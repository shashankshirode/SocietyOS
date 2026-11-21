import { Text, View, Pressable, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { MarketplaceListing } from "../../../shared/types/marketplace.types";
import { SkillProfile } from "../../../shared/types/skillDirectory.types";
import { BorrowableItem } from "../../../shared/types/borrowLend.types";
import { LostFoundItem } from "../../../shared/types/lostFound.types";
import { formatResidentCurrency, formatResidentDate } from "../../../core/localization/dateTimeFormatters";
import { styles, createViewBackgroundColorStyle, createTextColorStyle } from "../styles/components/CommunityComponents.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface MarketplaceListingCardProps {
    listing: MarketplaceListing;
    onPress: () => void;
}
export function MarketplaceListingCard({ listing, onPress }: MarketplaceListingCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const isFree = listing.isGiveaway;
    return (<Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {listing.imageUrl ? (<Image source={{ uri: listing.imageUrl }} style={styles.image}/>) : (<View style={[styles.imagePlaceholder, styles.viewBackgroundColor]}>
            <Ionicons name="cart-outline" size={32} color={Colors.info}/>
          </View>)}
        <View style={styles.conditionBadgeContainer}>
          <StatusBadge label={listing.condition} type={listing.condition === 'NEW' ? 'success' : 'info'}/>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{listing.description}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.price}>
            {isFree ? localizedUiText.m_f411a1fb6275 : formatResidentCurrency(listing.price ?? 0)}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="person-outline" size={12} color={Colors.neutral}/>
            <Text style={styles.metaText}>{listing.sellerUnit}</Text>
          </View>
        </View>
      </View>
    </Pressable>);
}
interface SkillProfileCardProps {
    profile: SkillProfile;
    onPress: () => void;
}
export function SkillProfileCard({ profile, onPress }: SkillProfileCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<Pressable style={styles.card} onPress={onPress}>
      <View style={styles.skillHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{profile.residentName.charAt(0)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={1}>{profile.title}</Text>
          <Text style={styles.subtitle}>{profile.residentName} ({profile.residentUnit})</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>{profile.description}</Text>

      <View style={styles.skillsContainer}>
        {profile.skills.slice(0, 3).map((skill, idx) => (<View key={idx} style={styles.skillChip}>
            <Text style={styles.skillChipText}>{skill}</Text>
          </View>))}
        {profile.skills.length > 3 && (<Text style={styles.moreSkillsText}>+{profile.skills.length - 3}{" " + localizedUiText.m_187897ce0afc}</Text>)}
      </View>

      <View style={styles.cardFooterBorder}>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#FFD700"/>
          <Text style={styles.ratingText}>{profile.averageRating.toFixed(1)}</Text>
          <Text style={styles.reviewsText}>({profile.reviewsCount}{" " + localizedUiText.m_4750d8da5828}</Text>
        </View>
        <Text style={styles.experienceText}>{profile.experienceYears}{" " + localizedUiText.m_7b6adbd261d6}</Text>
      </View>
    </Pressable>);
}
interface BorrowableItemCardProps {
    item: BorrowableItem;
    onPress: () => void;
}
export function BorrowableItemCard({ item, onPress }: BorrowableItemCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<Pressable style={styles.card} onPress={onPress}>
      <View style={styles.borrowHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.category === 'TOOLS' ? 'hammer-outline' : item.category === 'BOOKS' ? 'book-outline' : 'cube-outline'} size={24} color={Colors.primary}/>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.subtitle}>{localizedUiText.m_9a638cfefd87 + " "}{item.ownerUnit}</Text>
        </View>
        <StatusBadge status={item.status} moduleType="borrow"/>
      </View>

      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

      <View style={styles.borrowFooter}>
        <Text style={styles.durationText}>{localizedUiText.m_ef2840cc402e + " "}{item.maxDurationDays}{" " + localizedUiText.m_ab51004e9d71}</Text>
        {item.depositRequired && (<View style={styles.depositRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color={Colors.success}/>
            <Text style={styles.depositText}>{localizedUiText.m_abd979bec333}</Text>
          </View>)}
      </View>
    </Pressable>);
}
interface LostFoundCardProps {
    item: LostFoundItem;
    onPress: () => void;
}
export function LostFoundCard({ item, onPress }: LostFoundCardProps) {
    const isLost = item.type === 'LOST';
    return (<Pressable style={styles.card} onPress={onPress}>
      <View style={styles.lostFoundHeader}>
        <View style={[styles.typeBadge, createViewBackgroundColorStyle(isLost ? Colors.dangerLight : Colors.successLight)]}>
          <Text style={[styles.typeBadgeText, createTextColorStyle(isLost ? Colors.danger : Colors.success)]}>
            {item.type}
          </Text>
        </View>
        <Text style={styles.lostFoundDate}>
          {formatResidentDate(item.dateHappened)}
        </Text>
      </View>

      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

      <View style={styles.lostFoundFooter}>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={Colors.neutral}/>
          <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
        </View>
        <StatusBadge status={item.status} moduleType="lostfound"/>
      </View>
    </Pressable>);
}
export function CommunityPrivacyNotice() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={[styles.banner, styles.privacyBanner]}>
      <Ionicons name="shield-half-outline" size={20} color={Colors.info} style={styles.bannerIcon}/>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{localizedUiText.m_038eea056369}</Text>
        <Text style={styles.bannerDescription}>{localizedUiText.m_a2a1bb50096f}</Text>
      </View>
    </View>);
}
export function CommunitySafetyNotice() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={[styles.banner, styles.safetyBanner]}>
      <Ionicons name="alert-circle-outline" size={20} color={Colors.warning} style={styles.bannerIcon}/>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{localizedUiText.m_a619b9b3565f}</Text>
        <Text style={styles.bannerDescription}>{localizedUiText.m_c0fac986276e}</Text>
      </View>
    </View>);
}

