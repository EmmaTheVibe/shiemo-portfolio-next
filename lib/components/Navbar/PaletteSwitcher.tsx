import { PALETTES } from "./palettes";
import styles from "./Navbar.module.css";

type Props = {
  palette: string;
  onSelect: (name: string) => void;
  className: string;
};

export function PaletteSwitcher({ palette, onSelect, className }: Props) {
  return (
    <div className={className} aria-label="Color palette">
      {PALETTES.map((item) => (
        <button
          key={item.name}
          type="button"
          className={palette === item.name ? styles.active : undefined}
          style={{ "--swatch": item.accent } as React.CSSProperties}
          aria-label={item.label}
          aria-pressed={palette === item.name}
          onClick={() => onSelect(item.name)}
        />
      ))}
    </div>
  );
}
