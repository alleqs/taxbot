import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatNumber } from '../../helper/common';
import type { AjDetalhe, ApOpPropria, InfoContrib } from '../../types';
import { codAjApur } from '../../constants/codAjApur';
import { sum } from 'lodash';
import { Timbre } from './Timbre';
import { Contribuinte } from './Contribuinte';


const styles = StyleSheet.create({

   page: {
      flexDirection: 'column',
      marginTop: 20,
      paddingBottom: 25,
   },
   headerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 7,
   },
   header: {
      fontFamily: 'Helvetica',
      fontSize: 12,
   },
   headerDetail: {
      fontFamily: 'Helvetica-Oblique',
      fontSize: 12,
   },
   line: {
      marginHorizontal: 30,
      borderTop: '1px solid #EEE',
   },
   headerTitle: {
      flexDirection: 'row',
   },
   tableContainer: {
      marginTop: 3
   },
   descrição: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      width: '50%',
      backgroundColor: '#eee',
      textAlign: 'left',
      paddingVertical: 3,
      paddingLeft: 160
   },
   valor: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      width: '50%',
      backgroundColor: '#eee',
      textAlign: 'right',
      paddingVertical: 3,
      paddingRight: 10
   },
   itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 30
   },
   item: {
      fontSize: 10,
      marginTop: 3,
      paddingVertical: 3,
      paddingHorizontal: 10,
      textTransform: 'uppercase'
   },
});

export function Apuracao(infoContrib: InfoContrib, apuracao: ApOpPropria, tpAjMap: Record<number, AjDetalhe[]>) {

   return (
      <Document>
         <Page size="A4" style={styles.page}>
            {Timbre()}
            <View style={styles.line} />
            <View style={styles.headerContainer}>
               <Text style={styles.header}>REGISTROS FISCAIS DA APURAÇÃO DO ICMS </Text>
               <Text style={{ ...styles.headerDetail }}>- OPERAÇÕES PRÓPRIAS</Text>
            </View>
            <View style={styles.line} />
            {Contribuinte(infoContrib, [apuracao.iniPerApur, apuracao.fimPerApur])}

            <View style={styles.tableContainer}>
               <View style={styles.itemContainer}>
                  <Text style={styles.descrição}>Descrição</Text>
                  <Text style={styles.valor}>Valor (R$)</Text>
               </View>
               <View style={{ ...styles.itemContainer }}>
                  <Text style={styles.item}>SAÍDAS E PRESTAÇÕES COM DÉBITO DO IMPOSTO</Text>
                  <Text style={styles.item}>{formatNumber(apuracao.saídas)}</Text>
               </View>
               <View style={{ ...styles.itemContainer, backgroundColor: '#f5f5f5' }}>
                  <Text style={styles.item}>VALOR TOTAL DOS AJUSTES A DÉBITO (decorrentes do documento fiscal)</Text>
                  <Text style={styles.item}>{formatNumber(apuracao.ajDocFiscal)}</Text>
               </View>
               <View style={{ ...styles.itemContainer }}>
                  <Text style={styles.item}>VALOR TOTAL DOS AJUSTES A DÉBITO DO IMPOSTO</Text>
                  <Text style={styles.item}>{formatNumber(apuracao.aj)}</Text>
               </View>
               <View style={{ ...styles.itemContainer, backgroundColor: '#f5f5f5' }}>
                  <Text style={styles.item}>VALOR TOTAL DOS ESTORNOS DE CRÉDITOS </Text>
                  <Text style={styles.item}>{formatNumber(apuracao.estCred)}</Text>
               </View>
               <View style={{ ...styles.itemContainer }}>
                  <Text style={styles.item}>VALOR TOTAL DOS CRÉDITOS POR ENTRADAS E AQUISIÇÕES COM CRÉDITO DO IMPOSTO</Text>
                  <Text style={styles.item}>{formatNumber(apuracao.credAq)}</Text>
               </View>
               <View style={{ ...styles.itemContainer, backgroundColor: '#f5f5f5' }}>
                  <Text style={styles.item}>VALOR TOTAL DOS AJUSTES A CRÉDITO (decorrentes do documento fiscal) </Text>
                  <Text style={styles.item}>{formatNumber(apuracao.ajCredDocFiscal)}</Text>
               </View>
               <View style={{ ...styles.itemContainer }}>
                  <Text style={styles.item}>VALOR TOTAL DOS AJUSTES A CRÉDITO DO IMPOSTO</Text>
                  <Text style={styles.item}>{formatNumber(apuracao.ajCred)}</Text>
               </View>
               <View style={{ ...styles.itemContainer, backgroundColor: '#f5f5f5' }}>
                  <Text style={styles.item}>VALOR TOTAL DOS ESTORNOS DE DÉBITOS</Text>
                  <Text style={styles.item}>{formatNumber(apuracao.estDeb)}</Text>
               </View>
               <View style={{ ...styles.itemContainer }}>
                  <Text style={styles.item}>VALOR TOTAL DO SALDO CREDOR DO PERÍODO ANTERIOR</Text>
                  <Text style={styles.item}>{formatNumber(apuracao.saldoAcc)}</Text>
               </View>
               <View style={{ ...styles.itemContainer, backgroundColor: '#f5f5f5' }}>
                  <Text style={styles.item}>VALOR DO SALDO DEVEDOR</Text>
                  <Text style={styles.item}>{formatNumber(apuracao.saldoDev)}</Text>
               </View>
               <View style={{ ...styles.itemContainer }}>
                  <Text style={styles.item}>VALOR TOTAL DAS DEDUÇÕES</Text>
                  <Text style={styles.item}>{formatNumber(apuracao.deducoes)}</Text>
               </View>
               <View style={{ ...styles.itemContainer, backgroundColor: '#f5f5f5' }}>
                  <Text style={styles.item}>VALOR TOTAL DO ICMS A RECOLHER</Text>
                  <Text style={styles.item}>{formatNumber(apuracao.icmsARec)}</Text>
               </View>
               <View style={{ ...styles.itemContainer }}>
                  <Text style={styles.item}>VALOR TOTAL DO SALDO CREDOR A TRANSPORTAR PARA O PERÍODO SEGUINTE </Text>
                  <Text style={styles.item}>{formatNumber(apuracao.saldoCredorProxPer)}</Text>
               </View>
               <View style={{ ...styles.itemContainer, backgroundColor: '#f5f5f5' }}>
                  <Text style={styles.item}>VALORES RECOLHIDOS OU A RECOLHER, EXTRA-APURAÇÃO</Text>
                  <Text style={styles.item}>{formatNumber(apuracao.recExtraAp)}</Text>
               </View>
            </View>

            {Object.entries(tpAjMap).map(([cod, ajDetalhes], i) =>
               getDetailTable(i, codAjApur[+cod], ajDetalhes)
            )}
         </Page>
      </Document>
   );
};

const detailStyle = StyleSheet.create({
   detailContainer: {
      marginTop: 15
   },
   subHeaderContainer: {
      marginHorizontal: 10,
      paddingHorizontal: 30,
      paddingTop: 5,
   },
   subHeader: {
      fontFamily: 'Helvetica-BoldOblique',
      fontSize: 12,
   },
   itemContainer: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      marginHorizontal: 40
   },
   itemCenter: {
      flex: 12.5,
      fontSize: 10,
      marginTop: 3,
      paddingVertical: 3,
      textAlign: 'center',
   },
   itemLeft: {
      flex: 80,
      fontSize: 10,
      marginTop: 3,
      paddingVertical: 3,
      textAlign: 'left',
      textTransform: 'uppercase'
   },
   item: {
      flex: 20,
      fontSize: 10,
      marginTop: 3,
      paddingVertical: 3,
      textAlign: 'right',
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
   }
})

function getDetailTable(key: number, title: string, ajDetalhes: AjDetalhe[]) {
   return (
      <View wrap={false} key={key} style={detailStyle.detailContainer}>
         <View style={styles.line} />
         <View style={detailStyle.subHeaderContainer}>
            <Text style={detailStyle.subHeader}>{title}:</Text>
         </View>
         <View style={styles.tableContainer}>
            <View style={styles.itemContainer}>
               <Text style={styles.descrição}>Descrição</Text>
               <Text style={styles.valor}>Valor (R$)</Text>
            </View>
         </View>
         {ajDetalhes.map(({ descr, val }, i) =>
            <View key={i} style={{ ...detailStyle.itemContainer, ...(i % 2 === 1) && { backgroundColor: '#f5f5f5' }, }}>
               <Text style={detailStyle.itemLeft}>{descr}</Text>
               <Text style={detailStyle.item}>{formatNumber(val)}</Text>
            </View>
         )}
         <View style={detailStyle.totalContainer}>
            <Text style={detailStyle.total}>Total</Text>
            <Text style={detailStyle.total}>{formatNumber(sum(ajDetalhes.map(a => a.val)))}</Text>
         </View>
      </View>
   );
}
