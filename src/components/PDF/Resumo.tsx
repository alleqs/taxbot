import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatNumber } from '../../helper/common';
import type { InfoContrib, ResumoAnalitico, Summary } from '../../types';
import { sum } from 'lodash';
import { Timbre } from './Timbre';
import { Contribuinte } from './Contribuinte';

const styles = StyleSheet.create({

   page: {
      flexDirection: 'column',
      marginTop: 30,
   },
   line: {
      marginHorizontal: 30,
      borderTop: '1px solid #EEE',
   },
   headerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
      // marginBottom: 7,
   },
   header: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 12,
   },
   // headerTitle: {
   //    flexDirection: 'row',
   // },
   // tableContainer: {
   //    marginTop: 3
   // },
   // descrição: {
   //    fontSize: 11,
   //    fontFamily: 'Helvetica-Bold',
   //    width: '50%',
   //    backgroundColor: '#eee',
   //    textAlign: 'left',
   //    paddingVertical: 3,
   //    paddingLeft: 160
   // },
   // valor: {
   //    fontSize: 11,
   //    fontFamily: 'Helvetica-Bold',
   //    width: '50%',
   //    backgroundColor: '#eee',
   //    textAlign: 'right',
   //    paddingVertical: 3,
   //    paddingRight: 10
   // },
   // itemContainer: {
   //    flexDirection: 'row',
   //    justifyContent: 'space-between',
   //    marginHorizontal: 30
   // },
   // item: {
   //    fontSize: 10,
   //    marginTop: 3,
   //    paddingVertical: 3,
   //    paddingHorizontal: 10,
   //    textTransform: 'uppercase'
   // },
});

export function Resumo(infoContrib: InfoContrib, { entrTribInt, entrTribNaoInt, entrNaoTribInt, entrNaoTribNaoInt, sdTribInt, sdTribNaoInt, sdNaoTribInt, sdNaoTribNaoInt }: ResumoAnalitico) {

   return (
      <Document>
         {Resumo2(infoContrib, 1, 'ENTRADAS', entrTribInt, entrTribNaoInt, entrNaoTribInt, entrNaoTribNaoInt)}
         {Resumo2(infoContrib, 2, 'SAÍDAS', sdTribInt, sdTribNaoInt, sdNaoTribInt, sdNaoTribNaoInt)}
         {/* <Page size="A4" style={styles.page}>
            {Timbre()}
            {Contribuinte(infoContrib)}

            <View style={styles.line} />
            <View style={styles.headerContainer}>
               <Text style={styles.header}>1. ENTRADAS</Text>
            </View>

            {getDetailTable(entrTribInt, '1.1. Operações Tributáveis', '1.1.1. Operações Internas')}
            {getDetailTable(entrTribNaoInt, '1.1.2. Operações Interestaduais / Importação')}

            {getDetailTable(entrNaoTribInt, '1.2. Operações Não Tributáveis', '1.2.1. Operações Internas')}
            {getDetailTable(entrNaoTribNaoInt, '1.2.2. Operações Interestaduais / Importação')}

         </Page> */}
      </Document>
   );
}

export function Resumo2(infoContrib: InfoContrib, index: number, title: string, opsTribInt: Summary[], opsTribNaoInt: Summary[], opsNaoTribInt: Summary[], opsNaoTribNaoInt: Summary[]) {

   return (
      // <Document>
      <Page size="A4" style={styles.page}>
         {Timbre()}
         {Contribuinte(infoContrib)}

         <View style={styles.line} />
         <View style={styles.headerContainer}>
            <Text style={styles.header}>{`${index}. ${title}`}</Text>
         </View>

         {getDetailTable(opsTribInt, `${index}.1. Operações Tributáveis`, `${index}.1.1. Operações Internas`)}
         {getDetailTable(opsTribNaoInt, `${index}.1.2. Operações Interestaduais / Importação`)}

         {getDetailTable(opsNaoTribInt, `${index}.2. Operações Não Tributáveis`, `${index}.2.1. Operações Internas`)}
         {getDetailTable(opsNaoTribNaoInt, `${index}.2.2. Operações Interestaduais / Importação`)}

      </Page>
      // </Document>
   );
}



const detailStyle = StyleSheet.create({
   detailContainer: {
      // marginTop: 15
   },
   subHeaderContainer: {
      // flexDirection: 'row',
      // justifyContent: 'flex-start',
      marginHorizontal: 10,
      paddingHorizontal: 30,
      paddingTop: 5,
   },
   subHeader: {
      fontFamily: 'Helvetica-Oblique',
      fontSize: 12,
   },
   totalContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginHorizontal: 30
   },
   total: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 10,
      paddingVertical: 3,
      paddingHorizontal: 10,
   },
   tableContainer: {
      marginTop: 3,
   },
   tableHeaderContainer: {
      backgroundColor: '#eee',
      flexDirection: 'row',
      // justifyContent: 'space-around',
      marginHorizontal: 40
   },
   coluna: {
      flex: 1,
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      paddingVertical: 3,
      textAlign: 'right',
   },
   itemContainer: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      marginHorizontal: 40
   },
   item: {
      flex: 1,
      fontSize: 10,
      marginTop: 3,
      paddingVertical: 3,
      // paddingHorizontal: 10,
      // width: 33.333,
      textAlign: 'right',
      // textTransform: 'uppercase'
   },
})

function getDetailTable(analiticoArr: Summary[], title: string, subTitle?: string) {
   return (
      <View wrap={false} style={detailStyle.detailContainer}>
         <View style={detailStyle.subHeaderContainer}>
            <Text style={{ ...detailStyle.subHeader, ...(subTitle) && { fontFamily: 'Helvetica-BoldOblique' } }}>{title}</Text>
         </View>
         {subTitle && <View style={detailStyle.subHeaderContainer}>
            <Text style={detailStyle.subHeader}>{subTitle}</Text>
         </View>}
         <View style={detailStyle.tableContainer}>
            <View style={detailStyle.tableHeaderContainer}>
               <Text style={detailStyle.coluna}>CFOP</Text>
               <Text style={detailStyle.coluna}>Alíquota</Text>
               <Text style={detailStyle.coluna}>Vl. Contáb.</Text>
               <Text style={detailStyle.coluna}>Base Cálc.</Text>
               <Text style={detailStyle.coluna}>ICMS Cred.</Text>
            </View>
         </View>
         {analiticoArr.map(({ cfopAliq, valOper, bc, icms }, i) => {
            const [cfop, aliq] = cfopAliq.split('-')
            return (
               <View key={i} style={{ ...detailStyle.itemContainer, ...(i % 2 === 1) && { backgroundColor: '#f5f5f5' }, }}>
                  <Text style={detailStyle.item}>{cfop}</Text>
                  <Text style={detailStyle.item}>{aliq}</Text>
                  <Text style={detailStyle.item}>{formatNumber(valOper)}</Text>
                  <Text style={detailStyle.item}>{formatNumber(bc)}</Text>
                  <Text style={detailStyle.item}>{formatNumber(icms)}</Text>
               </View>)
         }
         )}
         <View style={detailStyle.totalContainer}>
            <Text style={detailStyle.total}>Total</Text>
            <Text style={detailStyle.total}>{formatNumber(sum(analiticoArr.map(a => a.icms)))}</Text>
         </View>
      </View>
   );
}