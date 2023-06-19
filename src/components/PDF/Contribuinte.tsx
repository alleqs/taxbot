import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatCNPJ, formatDate, formatIE } from '../../helper/common';
import type { InfoContrib } from '../../types';

const styles = StyleSheet.create({

   dadoContribContainer: {
      marginTop: 10,
      marginBottom: 20,
      paddingHorizontal: 10,
   },
   dadoContribLinha: {
      flexDirection: 'row',
      marginHorizontal: 30,
      marginTop: 10
   },
   dadoContribChave: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold'
      // fontWeight: 'extrabold',
      // textAlign: 'center',
   },
   dadoContribValor: {
      fontSize: 11,
   },
   dadoContribInscrContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
});

export function Contribuinte(infoContrib: InfoContrib, dtTuple?: [Date, Date]) {

   return (
      // <>

      <View style={styles.dadoContribContainer}>
         <View style={styles.dadoContribLinha}>
            <Text style={styles.dadoContribChave}>CONTRIBUINTE: </Text>
            <Text style={styles.dadoContribValor}>{infoContrib.nome}</Text>
         </View>
         <View style={styles.dadoContribInscrContainer}>
            <View style={styles.dadoContribLinha}>
               <Text style={styles.dadoContribChave}>CNPJ/CPF: </Text>
               <Text style={styles.dadoContribValor}>{formatCNPJ(infoContrib.cnpj)}</Text>
            </View>
            <View style={styles.dadoContribLinha}>
               <Text style={styles.dadoContribChave}>INSCRIÇÃO ESTADUAL: </Text>
               <Text style={styles.dadoContribValor}>{formatIE(infoContrib.IE)}</Text>
            </View>
         </View>
         <View style={styles.dadoContribLinha}>
            <Text style={styles.dadoContribChave}>PERÍODO DA ESCRITURAÇÃO: </Text>
            <Text style={styles.dadoContribValor}>{`${formatDate(infoContrib.iniEscrit)} a ${formatDate(infoContrib.fimEscrit)}`}</Text>
         </View>
         {dtTuple && <View style={styles.dadoContribLinha}>
            <Text style={styles.dadoContribChave}>PERÍODO DA APURAÇÃO: </Text>
            <Text style={styles.dadoContribValor}>{`${formatDate(dtTuple[0])} a ${formatDate(dtTuple[1])}`}</Text>
         </View>}
      </View>
      // </>
   );
}