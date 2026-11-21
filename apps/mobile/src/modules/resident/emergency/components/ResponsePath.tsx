import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { emergencyTheme } from '../theme/emergencyTheme';
import { useMessages } from '../../../../messages/useMessages';
import type { SosResolvedRecipient } from '../data/sosResponsePlan.types';
interface ResponsePathProps {
    unitName: string;
    recipients: SosResolvedRecipient[];
    accentColor: string;
}
export function ResponsePath({ unitName, recipients, accentColor, }: ResponsePathProps) {
    const copy = useMessages().resident.emergency.crisis;
    const nodes = [
        {
            id: 'home',
            label: unitName || 'Your Home',
            subtext: 'Origin point',
            icon: 'home-outline' as const,
            isOrigin: true,
        },
        ...recipients.map((r) => ({
            id: r.recipientId,
            label: r.displayName,
            subtext: copy.configured,
            icon: (r.recipientType === 'societyRole'
                ? 'shield-checkmark-outline'
                : r.recipientType === 'familyMember' || r.recipientType === 'externalEmergencyContact'
                    ? 'people-outline'
                    : 'business-outline') as keyof typeof Ionicons.glyphMap,
            isOrigin: false,
        })),
    ];
    return (<View style={styles.container}>
      <SafeText variant="tiny" style={[styles.header, { color: emergencyTheme.textSecondary }]}>
        {copy.responsePathTitle}
      </SafeText>

      <View style={styles.chain}>
        {nodes.map((node, index) => {
            const isLast = index === nodes.length - 1;
            return (<View key={node.id} style={styles.nodeRow}>
              <View style={styles.railColumn}>
                <View style={[
                    styles.nodeDot,
                    {
                        borderColor: node.isOrigin ? accentColor : emergencyTheme.connector,
                        backgroundColor: node.isOrigin ? `${accentColor}33` : emergencyTheme.surfaceRaised,
                    },
                ]}>
                  <Ionicons name={node.icon} size={12} color={node.isOrigin ? accentColor : emergencyTheme.textSecondary}/>
                </View>
                {!isLast && <View style={[styles.nodeLine, { backgroundColor: emergencyTheme.connector }]}/>}
              </View>

              <View style={styles.nodeContent}>
                <SafeText variant="caption" style={[styles.nodeLabel, { color: emergencyTheme.text, fontWeight: node.isOrigin ? '700' : '500' }]} numberOfLines={1}>
                  {node.label}
                </SafeText>
                <SafeText variant="tiny" style={[styles.nodeSub, { color: emergencyTheme.textMuted }]}>
                  {node.subtext}
                </SafeText>
              </View>
            </View>);
        })}
      </View>
    </View>);
}
const styles = StyleSheet.create({
    container: {
        gap: 8,
        paddingHorizontal: 4,
    },
    header: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    chain: {
        gap: 0,
    },
    nodeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    railColumn: {
        alignItems: 'center',
        width: 24,
    },
    nodeDot: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nodeLine: {
        width: 1.5,
        height: 16,
        marginVertical: 2,
    },
    nodeContent: {
        flex: 1,
        paddingTop: 2,
        paddingBottom: 8,
    },
    nodeLabel: {
        fontSize: 13,
    },
    nodeSub: {
        fontSize: 11,
    },
});

