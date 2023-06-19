import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatNumber } from '../../helper/common';
import type { InfoContrib, ResumoAnalitico, Summary } from '../../types';
import { sum } from 'lodash';
import { Timbre } from './Timbre';
import { Contribuinte } from './Contribuinte';
import { cfopMap } from '../../constants/cfopMap';

const styles = StyleSheet.create({

   page: {
      flexDirection: 'column',
      marginTop: 15,
      // paddingBottom: 20,
      // marginBottom: 20,
   },
   line: {
      marginHorizontal: 30,
      borderTop: '1px solid #EEE',
   },
   mainHeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 7,
   },
   mainHeader: {
      fontFamily: 'Helvetica',
      fontSize: 12,
   },
   headerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
   },
   header: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 12,
   },
});

export function Resumo(infoContrib: InfoContrib, { entrTribInt, entrTribNaoInt, entrNaoTribInt, entrNaoTribNaoInt, sdTribInt, sdTribNaoInt, sdNaoTribInt, sdNaoTribNaoInt }: ResumoAnalitico) {

   return (
      <Document>
         {PagResumo(infoContrib, 1, 'ENTRADAS', entrTribInt, entrTribNaoInt, entrNaoTribInt, entrNaoTribNaoInt)}
         {PagResumo(infoContrib, 2, 'SAÍDAS', sdTribInt, sdTribNaoInt, sdNaoTribInt, sdNaoTribNaoInt)}
      </Document>
   );
}

export function PagResumo(infoContrib: InfoContrib, index: number, title: string, opsTribInt: Summary[], opsTribNaoInt: Summary[], opsNaoTribInt: Summary[], opsNaoTribNaoInt: Summary[]) {

   return (
      <Page size="A4" style={styles.page}>
         {Timbre()}
         <View style={styles.line} />
         <View style={styles.mainHeaderContainer}>
            <Text style={styles.mainHeader}>APURAÇÃO OP. PRÓPRIAS - ANALÍTICO</Text>
         </View>
         <View style={styles.line} />
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
   );
}



const detailStyle = StyleSheet.create({
   detailContainer: {
      // marginTop: 15
   },
   line: {
      marginHorizontal: 40,
      borderTop: '1px solid #EEE',
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
   tableContainer: {
      marginTop: 5,
   },
   tableHeaderContainer: {
      backgroundColor: '#eee',
      flexDirection: 'row',
      // justifyContent: 'space-around',
      marginHorizontal: 40
   },
   colCentro: {
      flex: 7,
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      paddingVertical: 3,
      textAlign: 'center',
   },
   colAliq: {
      flex: 5,
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      paddingVertical: 3,
      textAlign: 'center',
   },
   colDesc: {
      flex: 43,
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      paddingVertical: 3,
      textAlign: 'center',
   },
   colunaValor: {
      flex: 15,
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
   itemCenter: {
      flex: 7,
      fontSize: 10,
      marginTop: 3,
      paddingVertical: 3,
      textAlign: 'center',
   },
   itemAliq: {
      flex: 5,
      fontSize: 10,
      marginTop: 3,
      paddingVertical: 3,
      textAlign: 'center',
   },
   itemDesc: {
      flex: 43,
      fontSize: 8,
      marginTop: 3,
      paddingVertical: 3,
      textAlign: 'left',
   },
   itemValor: {
      flex: 15,
      fontSize: 10,
      marginTop: 3,
      paddingVertical: 3,
      textAlign: 'right',
   },
   totalContainer: {
      flexDirection: 'row',
      // justifyContent: 'flex-end',
      marginHorizontal: 40
   },
   totalBlank: {
      flex: 55,
      fontFamily: 'Helvetica-Bold',
      fontSize: 10,
      paddingVertical: 3,
      // paddingHorizontal: 10,
      textAlign: 'right',
   },
   total: {
      flex: 15,
      fontFamily: 'Helvetica-Bold',
      fontSize: 10,
      paddingVertical: 3,
      textAlign: 'right',
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
               <Text style={detailStyle.colCentro}>CFOP</Text>
               <Text style={detailStyle.colDesc}>Descr.</Text>
               <Text style={detailStyle.colAliq}>Alq.</Text>
               <Text style={detailStyle.colunaValor}>Vl. Contáb.</Text>
               <Text style={detailStyle.colunaValor}>Base Cálc.</Text>
               <Text style={detailStyle.colunaValor}>ICMS</Text>
            </View>
         </View>
         {analiticoArr.map(({ cfopAliq, valOper, bc, icms }, i) => {
            const [cfop, aliq] = cfopAliq.split('-')
            return (
               <View key={i} style={{ ...detailStyle.itemContainer, ...(i % 2 === 1) && { backgroundColor: '#f5f5f5' }, }}>
                  <Text style={detailStyle.itemCenter}>{cfop}</Text>
                  <Text style={detailStyle.itemDesc}>{cfopMap[+cfop]}</Text>
                  <Text style={detailStyle.itemAliq}>{aliq}</Text>
                  <Text style={detailStyle.itemValor}>{formatNumber(valOper)}</Text>
                  <Text style={detailStyle.itemValor}>{formatNumber(bc)}</Text>
                  <Text style={detailStyle.itemValor}>{formatNumber(icms)}</Text>
               </View>)
         })}
         <View style={detailStyle.line} />
         <View style={detailStyle.totalContainer}>
            <Text style={detailStyle.totalBlank}>Totais</Text>
            <Text style={detailStyle.total}>{formatNumber(sum(analiticoArr.map(a => a.valOper)))}</Text>
            <Text style={detailStyle.total}>{formatNumber(sum(analiticoArr.map(a => a.bc)))}</Text>
            <Text style={detailStyle.total}>{formatNumber(sum(analiticoArr.map(a => a.icms)))}</Text>
         </View>
      </View>
   );
}