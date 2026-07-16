import { Image, StyleSheet, View } from 'react-native';

const LOGO = require('@/assets/images/madarik-logo.png');

interface Props {
  size?: 'small' | 'medium' | 'large';
}

const SIZES = {
  small:  { width: 130, height: 85 },
  medium: { width: 200, height: 130 },
  large:  { width: 260, height: 170 },
};

export default function MadarikLogo({ size = 'medium' }: Props) {
  const dims = SIZES[size];
  return (
    <View style={styles.wrap}>
      <Image source={LOGO} style={dims} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
