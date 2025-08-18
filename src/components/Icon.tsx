import * as LucideIcons from "lucide-react";

export function Icon({
  iconName,
  color,
}: {
  iconName: string;
  color?: string;
}) {
  const IconComponent = LucideIcons[
    iconName as keyof typeof LucideIcons
  ] as React.ComponentType<{ className?: string }>;

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      style={{
        color,
      }}
      className={`size-4 text-[${color}]`}
    />
  );
}
