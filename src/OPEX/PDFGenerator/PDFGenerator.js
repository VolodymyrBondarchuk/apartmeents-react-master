import React, { useEffect } from 'react';
import { View, Page, Text, Document, StyleSheet, Font } from '@react-pdf/renderer';
import dejavuNormal from '../../fonts/DejaVuSans.ttf';
import dejavuBold from '../../fonts/DejaVuSans-Bold.ttf';

Font.register({
    family: "Cyrillic",
    src: dejavuNormal
});

Font.register({
    family: "Cyrillic-Bold",
    src: dejavuBold
});
// Create styles
const styles = StyleSheet.create({
    // 1cm = 28pt
    page: {
        fontFamily: "Cyrillic",
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: "56pt",
        paddingLeft: '28pt'
    },
    table3: {
        flexDirection: 'row',
        border: '2 solid black'
    },
    table5: {
        flexDirection: 'column',
        marginTop: '50',
        paddingBottom: '10pt',
        fontFamily: 'Cyrillic',
        fontSize: 11
    },
    upperText: {
        textAlign: "left",
        fontSize: 12,
        marginBottom: '28pt',
        flexDirection: 'column'
    },
    dateInoviceTable: {
        flexDirection: 'column',
        border: '2 solid black',
        marginTop: 15,
        fontSize: 12,
        width: 210,
        marginBottom: 28
    },
    bankWires: {
        flexDirection: 'column',
        borderTop: '2 solid black',
        marginTop: 15,
        fontSize: 12,
        width: 288,
        marginBottom: 28
    }

});

const PDFGenerator = (props) => {
    useEffect(() => {

    });
    const isEnglish = props.english;
    let cntInvoice =
        isEnglish ? "INVOICE"
            : "СЧЕТ";
    let dateString =
        isEnglish ? "Date"
            : "Дата";
    let invoiceString =
        isEnglish ? "Invoice"
            : "Инвойс";
    let residenceString =
        isEnglish ? "Residence"
            : "Резиденция";
    let owner =
        isEnglish ? "Owner"
            : "Владелец";
    let addressString =
        isEnglish ? "Address"
            : "Адресс";
    let areaFirstString =
        isEnglish ? "Area"
            : "Площадь";
    let share =
        isEnglish ? "Доля"
            : "russian";
    let bankWiresString =
        isEnglish ? "Bank wires"
            : "Банковский счет для оплаты";
    let rnn =
        isEnglish ? "RNN"
            : "РНН";
    let iik =
        isEnglish ? "IIK"
            : "ИИК";
    let bin =
        isEnglish ? "BIN"
            : "БИН";
    let bik =
        isEnglish ? "BIK"
            : "БИК";
    let description =
        isEnglish ? "Description "
            : "Описание";
    let descriptionValue =
        isEnglish ? "Service invoice for "
            : "Счет за услуги оказанные";
    let rate =
        isEnglish ? "Rate (USD)"
            : "Ставка";
    let area =
        isEnglish ? "Area (sq.m.)"
            : "Плошадь кв.м.";
    let ex_rate =
        isEnglish ? "Exchange Rate USD/KZT"
            : "Курс USD/KZT";
    let amountString =
        isEnglish ? "Amount"
            : "Сумма";
    let totalString =
        isEnglish ? "Total"
            : "Итого";
    let outBalanceString =
        isEnglish ? "Outstanding balance"
            : "Существующая задолженность";
    let creditBalanceString =
        isEnglish ? "Credit balance"
            : "Существующая переплата";
    let termsFirstRow =
        isEnglish ? "All invoices are stated in tenge, including VAT."
            : "Все счета выставляются в тенге, включая НДС.";
    let termsSecondRow =
        isEnglish ? "Advance payment invoices on Operating expenses are issued by 25th day of each month."
            : "Авансовые счета по эксплуатационным расходам выставляются ежемесячно до 25-го числа.";
    let termsThirdRow =
        isEnglish ? "Payment is due within 5 days of invoice submission, by 30th of each month."
            : "Счета подлежат оплате в течение 5 дней, до 30-го числа каждого месяца.";
    let termsFourthRow =
        isEnglish ? "Invoices not paid will bear the higher of 5% of the outstanding amount or 1,5% per month."
            : "В случае просрочки, начисляется неустойка, равная большей из 5% от неоплаченной суммы или 1,5% за каждый месяц.";
    let receivedDateString =
        isEnglish ? "Received date"
            : "Дата получения";
    let signCompanyString =
        isEnglish ? "Sign of the company"
            : "Печать компании";

    return (
        <>
            <Document>
                {props.invoices.map(invoice => {
                    let jsonDate = new Date(invoice.date_stamp);
                    let date = `${jsonDate.getMonth() + 1}/${jsonDate.getDate()}/${jsonDate.getFullYear()}`;
                    let setTodayDate = new Date();
                    let todayDate = `${setTodayDate.getDate()}/${setTodayDate.getMonth() + 1}/${setTodayDate.getFullYear()}`;
                    return (

                        <Page size="A4" style={styles.page} key={invoice.invoice_id}>
                            <View>

                                <View style={styles.upperText}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text>{invoice.company_name}</Text>
                                        <Text style={{ fontFamily: 'Cyrillic-Bold', marginLeft: 270 }}>{cntInvoice}</Text>
                                    </View>
                                    <Text>{invoice.company_address}</Text>
                                </View>

                                <View style={{ flexDirection: 'column' }}>
                                    <View style={{ flexDirection: 'row' }}>

                                        <View>
                                            {/* TABLE1 LEFT START */}
                                            <View style={styles.dateInoviceTable}>

                                                <View style={{ flexDirection: 'row' }}>
                                                    {/* 508 */}
                                                    <View style={{ width: '100pt' }}>
                                                        <Text style={{ fontFamily: 'Cyrillic-Bold', padding: '3pt', borderRight: '1 solid black' }}>{dateString}</Text>
                                                    </View>
                                                    <View style={{ width: '110pt', padding: '3pt', fontFamily: 'Cyrillic-Bold' }}>
                                                        <Text>{invoiceString}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', borderTop: '1 solid black' }}>
                                                    <View style={{ width: '100pt', borderRight: '1 solid black', padding: '3pt' }}>
                                                        <Text>{todayDate}</Text>
                                                    </View>
                                                    <View style={{ width: '110pt', padding: '3pt' }}>
                                                        <Text>{invoice.invoice_id}</Text>
                                                    </View>

                                                </View>

                                            </View>
                                            <View style={{ ...styles.bankWires, border: "2 solid black", width: 210 }}>
                                                <Text style={{ padding: '3pt', fontFamily: 'Cyrillic-Bold', borderBottom: '1pt solid black' }}>{residenceString} - {invoice.number}</Text>
                                                <Text style={{ padding: '3pt', borderBottom: '1pt solid black' }}>{owner} - {invoice.owner_name}</Text>
                                                <Text style={{ padding: '3pt', borderBottom: '1pt solid black' }}>{addressString} - {invoice.address}</Text>
                                                <Text style={{ padding: '3pt', borderBottom: '1pt solid black' }}>{areaFirstString} - {invoice.area} (sq.m.)</Text>
                                                <Text style={{ padding: '3pt' }}>{share} - {invoice.share} %</Text>
                                            </View>


                                        </View>
                                        {/* TABLE1 LEFT END */}

                                        {/* TABLE2 Right START */}
                                        <View style={{ ...styles.bankWires, marginLeft: 50 }}>

                                            <Text style={{ padding: '5pt', fontFamily: 'Cyrillic-Bold', borderBottom: '1pt solid black', borderLeft: '2 solid black', borderRight: '2 solid black' }}>{bankWiresString}</Text>
                                            <Text style={{ padding: '5pt', borderBottom: '1pt solid black', borderLeft: '2 solid black', borderRight: '2 solid black' }}>{invoice.company_name}</Text>
                                            <Text style={{ padding: '5pt', borderBottom: '1pt solid black', borderLeft: '2 solid black', borderRight: '2 solid black' }}>{invoice.company_address}</Text>
                                            <Text style={{ padding: '5pt', borderBottom: '1pt solid black', borderLeft: '2 solid black', borderRight: '2 solid black' }}>{rnn} {invoice.company_rnn}</Text>
                                            <Text style={{ padding: '5pt', borderBottom: '1pt solid black', borderLeft: '2 solid black', borderRight: '2 solid black' }}>{iik} {invoice.company_iik}</Text>
                                            <Text style={{ padding: '5pt', borderBottom: '1pt solid black', borderLeft: '2 solid black', borderRight: '2 solid black' }}>{bin} {invoice.company_bin}</Text>
                                            <Text style={{ padding: '5pt', alignContent: 'center', borderBottom: '2pt solid black', borderLeft: '2 solid black', borderRight: '2 solid black' }}>{bik} {invoice.company_bik}</Text>

                                        </View>
                                        {/* TABLE2 Right END */}
                                    </View>


                                </View>
                                {/* SECOND TABLE START*/}

                                {/* SECOND TABLE END*/}

                                {/* THIRD TABLE START  */}

                                <View style={{ flexDirection: 'column', marginTop: 15 }}>
                                    {/* HEADER 508pt */}
                                    <View style={styles.table3}>

                                        <View style={{ width: '200pt', fontSize: 12, textAlign: 'center', fontFamily: 'Cyrillic-Bold', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{description}</Text>

                                        </View>
                                        <View style={{ width: '85pt', fontSize: 12, textAlign: 'center', fontFamily: 'Cyrillic-Bold', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{rate}</Text>
                                        </View>
                                        <View style={{ width: '85pt', fontSize: 12, textAlign: 'center', fontFamily: 'Cyrillic-Bold', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{area}</Text>
                                        </View>
                                        <View style={{ width: '90pt', fontSize: 12, textAlign: 'center', fontFamily: 'Cyrillic-Bold', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{ex_rate}</Text>
                                        </View>
                                        <View style={{ width: '88pt', fontSize: 12, textAlign: 'center', fontFamily: 'Cyrillic-Bold', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{amountString}</Text>
                                        </View>

                                    </View>
                                    <View style={{ ...styles.table3, marginTop: -2 }}>

                                        <View style={{ width: '200pt', fontSize: 12, textAlign: 'center', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{descriptionValue} {date}</Text>

                                        </View>
                                        <View style={{ width: '85pt', fontSize: 12, textAlign: 'center', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{invoice.rate}</Text>
                                        </View>
                                        <View style={{ width: '85pt', fontSize: 12, textAlign: 'center', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{invoice.area}</Text>
                                        </View>
                                        <View style={{ width: '90pt', fontSize: 12, textAlign: 'center', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{invoice.ex_rate}</Text>
                                        </View>
                                        <View style={{ width: '88pt', fontSize: 12, textAlign: 'center', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{invoice.amount}</Text>
                                        </View>

                                    </View>

                                    <View style={{ ...styles.table3, marginTop: -2 }}>

                                        <View style={{ width: '460pt', fontSize: 12, textAlign: 'right', fontFamily: 'Cyrillic-Bold', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{totalString}</Text>
                                        </View>
                                        <View style={{ width: '88pt', fontSize: 12, textAlign: 'right', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{invoice.amount}</Text>
                                        </View>

                                    </View>

                                    <View style={{ ...styles.table3, marginTop: -2 }}>

                                        <View style={{ width: '460pt', fontSize: 12, textAlign: 'right', fontFamily: 'Cyrillic-Bold', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{outBalanceString}</Text>
                                        </View>
                                        <View style={{ width: '88pt', fontSize: 12, textAlign: 'right', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{'empty'}</Text>
                                        </View>

                                    </View>

                                    <View style={{ ...styles.table3, marginTop: -2 }}>

                                        <View style={{ width: '460pt', fontSize: 12, textAlign: 'right', fontFamily: 'Cyrillic-Bold', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{creditBalanceString}</Text>
                                        </View>
                                        <View style={{ width: '88pt', fontSize: 12, textAlign: 'right', padding: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                            <Text>{'empty'}</Text>
                                        </View>

                                    </View>

                                </View>
                                {/* THIRD TABLE END*/}

                                {/* FIFTH TABLE START*/}
                                <View style={styles.table5}>

                                    <View style={{ flexDirection: 'column' }}>
                                        <Text>
                                            {termsFirstRow}
                                        </Text>
                                        <Text>
                                            {termsSecondRow}
                                        </Text>
                                        <Text>
                                            {termsThirdRow}
                                        </Text>
                                        <Text>
                                            {termsFourthRow}
                                        </Text>

                                    </View>

                                    <View style={{ fontFamily: 'Cyrillic-Bold', paddingTop: '5pt', marginTop: 20, flexDirection: 'row' }}>
                                        <Text>{receivedDateString}</Text>
                                        <Text style={{ width: '200pt', marginLeft: '10pt', borderBottom: '2pt solid black', marginRight: '5pt' }}></Text>
                                    </View>

                                </View>

                                {/* FIFTH TABLE END*/}

                                {/* SIXTH TABLE START*/}
                                <View style={{ marginTop: '14', paddingBottom: '10pt' }}>

                                    <View style={{ fontSize: '11pt', flexDirection: 'row' }}>
                                        <Text style={{ fontFamily: 'Cyrillic-Bold' }}>{signCompanyString}</Text>
                                        <Text style={{ width: '200pt', marginLeft: '10pt', borderBottom: '2pt solid black', marginRight: '5pt' }}></Text>
                                    </View>
                                </View>

                                {/* SIXTH TABLE END*/}

                            </View>
                        </Page>
                    )
                })}
            </Document>
        </>
    );
}

export default PDFGenerator;