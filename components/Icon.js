import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, ArrowUp01Icon, PlusSignIcon, Settings01Icon } from '@hugeicons/core-free-icons';

const icons = {
  arrow: ArrowRight01Icon,
  up: ArrowUp01Icon,
  plus: PlusSignIcon,
  settings: Settings01Icon,
};

export function Icon({ name = 'arrow', size = 18, strokeWidth = 1.6 }) {
  return (
    <HugeiconsIcon
      icon={icons[name] ?? icons.arrow}
      size={size}
      color="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
    />
  );
}
