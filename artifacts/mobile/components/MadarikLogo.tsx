import { View, Text, StyleSheet } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';

interface Props {
  size?: 'small' | 'medium' | 'large';
  textColor?: string;
}

const SIZES = {
  small:  { text: 30, ringW: 86,  ringH: 18, gap: 4 },
  medium: { text: 44, ringW: 124, ringH: 24, gap: 6 },
  large:  { text: 58, ringW: 164, ringH: 30, gap: 8 },
};

export default function MadarikLogo({ size = 'medium', textColor = '#c7d2fe' }: Props) {
  const s = SIZES[size];
  const cx = s.ringW / 2;
  const cy = s.ringH / 2;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.arabic, { fontSize: s.text, color: textColor }]}>
        مدارك
      </Text>
      <View style={{ marginTop: s.gap }}>
        <Svg width={s.ringW} height={s.ringH}>
          {/* outer orbit */}
          <Ellipse
            cx={cx} cy={cy}
            rx={cx - 2} ry={cy - 2}
            fill="none"
            stroke="rgba(167,190,255,0.70)"
            strokeWidth="1.6"
          />
          {/* inner orbit */}
          <Ellipse
            cx={cx} cy={cy + 2}
            rx={cx - 16} ry={cy - 6}
            fill="none"
            stroke="rgba(167,190,255,0.35)"
            strokeWidth="1"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  arabic: {
    fontWeight: '800',
    textAlign: 'center',
    includeFontPadding: false,
    // system font handles Arabic — do NOT set fontFamily to Inter
  },
});
