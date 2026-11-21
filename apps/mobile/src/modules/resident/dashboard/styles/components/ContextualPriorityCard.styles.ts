import { StyleSheet, Platform } from 'react-native';

export const createCardToneStyle = (borderColor: string, backgroundColor: string) => ({
  borderColor,
  backgroundColor,
});

export const createCapsuleToneStyle = (backgroundColor: string) => ({
  backgroundColor,
});

export const createCapsuleTextStyle = (color: string) => ({
  color,
});

export const createCtaButtonStyle = (backgroundColor: string) => ({
  backgroundColor,
});

export const createSectionHeadingStyle = (color: string) => ({
  color,
});

export const createSectionLinkStyle = (color: string) => ({
  color,
});

export const createTimeLabelStyle = (color: string) => ({
  color,
});

export const createCardTitleStyle = (color: string) => ({
  color,
});

export const createCardSubtitleStyle = (color: string) => ({
  color,
});

export const createCtaButtonTextStyle = (color: string) => ({
  color,
});

export const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardBody: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 24,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ctaButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  hintText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});