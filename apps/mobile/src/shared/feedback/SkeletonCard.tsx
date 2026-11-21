import { Skeleton } from "./Skeleton";
import { AppCard } from "../cards/AppCard";
import { styles } from "./styles/SkeletonCard.styles";
export function SkeletonCard() {
    return (<AppCard style={styles.card}>
      <Skeleton height={14} width="80%" style={styles.marginBottomSm}/>
      <Skeleton height={10} width="60%" style={styles.marginBottomSm}/>
      <Skeleton height={10} width="40%"/>
    </AppCard>);
}
export default SkeletonCard;

