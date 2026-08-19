import { View } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useResidentTheme } from "../foundation/residentTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { WrapRow } from "../layout/WrapRow";
import { useMessages } from "../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createPressableScaleOpacityStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorBorderColorStyle } from "./styles/FacilitySlotSelector.styles";
export interface FacilitySlot {
    id: string;
    timeLabel: string;
    availability: 'available' | 'limited' | 'booked';
    spotsRemaining?: number;
}
export interface FacilitySlotSelectorProps {
    slots: FacilitySlot[];
    selectedSlotId?: string;
    onSlotSelect: (slotId: string) => void;
}
export function FacilitySlotSelector({ slots, selectedSlotId, onSlotSelect, }: FacilitySlotSelectorProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const labels = messages.resident.facilityBooking;
    return (<View style={styles.container}>
      <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
        {labels.selectSlot}
      </SafeText>

      <WrapRow gap={10}>
        {slots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            const isBooked = slot.availability === 'booked';
            const isLimited = slot.availability === 'limited';
            let bg: string = theme.surface;
            let border: string = theme.border;
            let textColor: string = theme.textPrimary;
            if (isBooked) {
                bg = theme.background;
                border = 'transparent';
                textColor = theme.textSecondary;
            }
            else if (isSelected) {
                bg = theme.accent;
                border = 'transparent';
                textColor = '#FFFFFF';
            }
            else if (isLimited) {
                bg = theme.accentSoft;
                border = theme.accent;
                textColor = theme.accent;
            }
            return (<PressableScale key={slot.id} onPress={() => !isBooked && onSlotSelect(slot.id)} disabled={isBooked} style={createPressableScaleOpacityStyle(isBooked ? 0.5 : 1)}>
              <View style={[styles.slot, createViewBackgroundColorBorderColorStyle(bg, border)]}>
                <SafeText variant="caption" style={createSafeTextColorStyle2(textColor)}>
                  {slot.timeLabel}
                </SafeText>
                {isLimited && !isSelected && (<SafeText variant="tiny" style={createSafeTextColorStyle3(theme.warning)}>
                    {labels.spotsLeft(slot.spotsRemaining ?? 0)}
                  </SafeText>)}
                {isBooked && (<SafeText variant="tiny" style={createSafeTextColorStyle4(theme.danger)}>
                    {labels.full}
                  </SafeText>)}
              </View>
            </PressableScale>);
        })}
      </WrapRow>
    </View>);
}
export default FacilitySlotSelector;

