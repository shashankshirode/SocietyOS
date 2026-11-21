import { Text, View } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { SupportTicket } from "../../../shared/types/platformSupport.types";
import { styles } from "../styles/components/SupportTicketCard.styles";
interface SupportTicketCardProps {
    ticket: SupportTicket;
    onPress: () => void;
}
export function SupportTicketCard({ ticket, onPress }: SupportTicketCardProps) {
    const isBreached = ticket.slaStatus === 'SLA_BREACHED';
    return (<AppCard pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.tktNumCol}>
          <Text style={styles.ticketNumber}>{ticket.ticketNumber}</Text>
          <Text style={styles.societyName}>{ticket.societyName}</Text>
        </View>
        <StatusBadge status={ticket.status} moduleType="platform"/>
      </View>

      <Text style={styles.subject} numberOfLines={1}>{ticket.subject}</Text>

      <View style={styles.footer}>
        <StatusBadge status={ticket.priority} moduleType="platform"/>
        <View style={styles.metaCol}>
          <Text style={[styles.slaText, isBreached && styles.slaBreached]}>
            {ticket.slaStatus.replace('_', ' ')}
          </Text>
          <Text style={styles.dateText}>
            {new Date(ticket.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </AppCard>);
}

