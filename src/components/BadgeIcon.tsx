import { Cpu, Crown, Flame, Footprints, Scale, Target, WandSparkles, Wrench } from 'lucide-react';
import type { Badge } from '../data/badges';

const map = { footprints: Footprints, cpu: Cpu, wrench: Wrench, scale: Scale, target: Target, wand: WandSparkles, flame: Flame, crown: Crown };

export function BadgeIcon({ icon, size = 32 }: { icon: Badge['icon']; size?: number }) {
  const Icon = map[icon];
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}
