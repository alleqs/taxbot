import { View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
   imageContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10
   },
   image: {
      width: '200px',
   },
})

export function Timbre() {

   return (
      <View fixed style={styles.imageContainer}>
         <Image style={styles.image} src={'/src/assets/timbre.png'} />
      </View>
   );
}