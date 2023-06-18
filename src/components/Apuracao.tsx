import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { formatCNPJ, formatDate, formatIE, formatNumber } from '../helper/common';
import type { AjDetalhe, ApOpPropria, InfoContrib } from '../types';
import { codAjApur } from '../constants/codAjApur';
import { sum } from 'lodash';


const styles = StyleSheet.create({

   page: {
      flexDirection: 'column',
      marginTop: 30,
   },
   imageContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10
   },
   image: {
      width: '200px',
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
      // marginHorizontal: 30,
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
            <View fixed style={styles.imageContainer}>
               <Image style={styles.image} src={'/src/assets/timbre.png'} />
            </View>
            <View style={styles.line} />
            <View style={styles.headerContainer}>
               <Text style={styles.header}>REGISTROS FISCAIS DA APURAÇÃO DO ICMS </Text>
               <Text style={{ ...styles.headerDetail }}>- OPERAÇÕES PRÓPRIAS</Text>
            </View>
            <View style={styles.line} />
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
               <View style={styles.dadoContribLinha}>
                  <Text style={styles.dadoContribChave}>PERÍODO DA APURAÇÃO: </Text>
                  <Text style={styles.dadoContribValor}>{`${formatDate(apuracao.iniPerApur)} a ${formatDate(apuracao.fimPerApur)}`}</Text>
               </View>
            </View>

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
      // textAlign: 'center'
   },
   totalContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginHorizontal: 30
   },
   total: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 10,
      // textTransform: 'uppercase',
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
            <View key={i} style={{ ...styles.itemContainer, ...(i % 2 === 1) && { backgroundColor: '#f5f5f5' }, }}>
               <Text style={styles.item}>{descr}</Text>
               <Text style={styles.item}>{formatNumber(val)}</Text>
            </View>
         )}
         <View style={detailStyle.totalContainer}>
            <Text style={detailStyle.total}>Total</Text>
            <Text style={detailStyle.total}>{formatNumber(sum(ajDetalhes.map(a => a.val)))}</Text>
         </View>
      </View>
   );
}
