import React, { useEffect } from 'react';
import { View, Page, Text, Document, StyleSheet, Font } from '@react-pdf/renderer';
import dejavuBold from '../../fonts/DejaVuSans-Bold.ttf';
import dejavuNormal from '../../fonts/DejaVuSans.ttf';

Font.register({
    family: "Cyrillic",
    src: dejavuNormal
});

Font.register({
    family: "Cyrillic-Bold",
    src: dejavuBold
});

// Create styles
const stylesUtilities = StyleSheet.create({
    // 1cm = 28pt
    page: {
        fontFamily: 'Cyrillic',
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: "56pt",
        paddingLeft: '28pt'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,

    },
    table: {
        flexDirection: 'row',
        border: '2 solid black'
    },
    tableEx: {
        flexDirection: 'row',
        border: '2 solid black',
        marginTop: -2
    },
    table1: {
        flexDirection: 'row',
        fontSize: 10,
        paddingBottom: 12
    },
    table3: {
        flexDirection: 'row',
        border: '2 solid black'
    },
    table3Ex: {
        flexDirection: 'row',
        border: '2 solid black',
        marginTop: -2
    },
    table4: {
        flexDirection: 'row',
        textAlign: "right",
        border: '2 solid white'
    },
    table5: {
        flexDirection: 'column',
        borderBottom: '2 solid black',
        marginTop: '14',
        paddingBottom: '10pt',
        fontSize: 12
    },
    item: {
        border: '1pt solid black',
        padding: 3
    },
    upperText: {
        marginLeft: '80pt',
        textAlign: "center",
        fontSize: 10,
        marginBottom: '28pt'
    },
    colStyle: {
        padding: '3pt',
        borderRight: '1pt solid black',
        fontSize: 10,
        flexDirection: 'column'
    },
    colStyle3: {
        padding: '3pt',
        borderRight: '1pt solid black',
        fontSize: 10,
        fontFamily: 'Cyrillic-Bold',
        flexDirection: 'column'
    },
    colStyle4: {
        padding: '3pt',
        borderRight: '1pt solid white',
        fontSize: 10,
        fontFamily: 'Cyrillic-Bold',
        flexDirection: 'column'
    }

});

const PDFGeneratorUtilities = (props) => {

    //const styles = props.style;
    const isEnglish = props.english;
    let rightUpperText =
        isEnglish ? `Attention! Payment of this invoice means acceptance of the terms of delivery of the goods. Payment notification is required, otherwise the product is not guaranteed in stock. The goods are released upon the fact of the arrival of money to the supplier's account, self-delivery, with a power of attorney and identity documents.`
            : 'Внимание! Оплата данного счета означает согласие с условиями поставки товара. Уведомление об оплате обязательно, в противном случае не гарантируется наличие товара на складе. Товар отпускается по фактуприхода денег на р/с Поставщика, самовывозом, при наличии доверенности и документов удостоверяющих личность.';
    let firstTableDescription =
        isEnglish ? "Sample of the payment order"
            : "Образец платежного поручения";
    let nameCompany =
        isEnglish ? "Name of the company:"
            : "Наименование компании";
    let iik =
        isEnglish ? "IIK"
            : "ИИК";
    let kbe =
        isEnglish ? "KBE"
            : "КБЕ";
    let bank_name =
        isEnglish ? "Name of the bank:"
            : "Наименование банка";
    let bik = 
        isEnglish ? "BIK"
            : 'БИК';
    let codePayment =
        isEnglish ? "Code of the payment:" :
            "Код платежа";
    let secondTableDescription =
        isEnglish ? "Payment invoice" //should be added Month and Year
            : "Счет на оплату";
    let provider =
        isEnglish ? "Provider:"
            : "Поставщик";
    let receiver =
        isEnglish ? "Receiver:"
            : "Покупатель";
    let agreement =
        isEnglish ? "Agreement:"
            : "Договор:";
    let iin =
        isEnglish ? "IIN"
            : "ИИН";
    let bin =
        isEnglish ? "BIN"
            : "БИН";
    let number =
        isEnglish ? "No"
            : "№";
    let name =
        isEnglish ? "Name"
            : "ФИО";
    let amount =
        isEnglish ? "Amount"
            : "Сумма";
    let volume =
        isEnglish ? "Volume"
            : "Объем";
    let price =
        isEnglish ? "Price"
            : "Цена";
    let totalPrice =
        isEnglish ? "Total price"
            : "Итого";
    let payElectricity =
        isEnglish ? "Payment for electricity"
            : "Платеж за электричество";
    let ycn =
        isEnglish ? "Unit"
            : "Ед.";
    let payHeating =
        isEnglish ? "Payment for heating"
            : "Платеж за отопление";
    let payWater =
        isEnglish ? "Payment for cold water"
            : "Платеж за холодную воду";
    let totalValue =
        isEnglish ? "Total:"
            : "Итог";
    let vatAmount =
        isEnglish ? "VAT amount:"
            : "НДС";
    let sumPositions =
        isEnglish ? "Sum of positions"
            : "Всего наименований";
    let forPayment =
        isEnglish ? "For payment"
            : "на сумму";
    let knobnesko =
        isEnglish ? "Administrant"
            : "Исполнитель";
    let printingTypeSetting =
        isEnglish ? "/"
            : "/";
    return (
        <>
            <Document>
                {props.invoices.map((invoice) => {
                    let electricity = invoice.electricity_amount;
                    let water = invoice.cold_water_amount;
                    let heating = invoice.heating_amount;
                    let total = electricity + water + heating;
                    let tax = (total * 0.12).toFixed(2);
                    return (<Page size="A4" style={stylesUtilities.page} key={invoice.invoice_id}>
                        <View>
                            <View style={stylesUtilities.upperText}>
                                <Text>{rightUpperText}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontFamily: 'Cyrillic-Bold', fontSize: 13, marginBottom: '4pt' }}>{firstTableDescription}</Text>
                                <View style={stylesUtilities.table}>
                                    <View style={Object.assign(stylesUtilities.colStyle, { width: '278pt' })}>
                                        <Text style={{ fontFamily: 'Cyrillic-Bold', paddingBottom: '1pt' }}>{nameCompany}</Text>
                                        <Text style={{ fontFamily: 'Cyrillic', paddingBottom: '4pt' }}>{invoice.company_name}</Text>
                                        <Text>{bin} {invoice.company_bin}</Text>

                                    </View>
                                    <View style={{ width: '130pt', fontSize: 10, paddingLeft: '3pt', fontFamily: 'Cyrillic-Bold', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{iik}</Text>
                                        <Text>
                                            {invoice.company_iik}
                                        </Text>
                                    </View>
                                    <View style={{ width: '100pt', fontSize: 10, paddingLeft: '3pt', fontFamily: 'Cyrillic-Bold', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{kbe}</Text>
                                        <Text>
                                            {invoice.kbe}
                                        </Text>
                                    </View>

                                </View>
                                <View style={stylesUtilities.tableEx}>
                                    <View style={Object.assign(stylesUtilities.colStyle, { width: '278pt' })}>
                                        <Text style={{ paddingBottom: '1pt' }}>{bank_name}</Text>
                                        <Text style={{ fontFamily: "Cyrillic" }}>{invoice.bank_name}</Text>

                                    </View>
                                    <View style={{ width: '100pt', fontSize: 10, fontFamily: 'Cyrillic-Bold', paddingLeft: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{bik}</Text>
                                        <Text>
                                            {invoice.company_bik}
                                        </Text>
                                    </View>
                                    <View style={{ width: '130pt', fontSize: 10, fontFamily: 'Cyrillic-Bold', paddingLeft: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{codePayment}</Text>
                                        <Text>
                                            {invoice.invoice_id}
                                        </Text>
                                    </View>

                                </View>

                            </View>
                            <Text
                                style={{ borderBottom: "1pt solid black", marginTop: '28pt', paddingBottom: '14pt', marginBottom: '8pt', fontFamily: 'Cyrillic-Bold' }}>{secondTableDescription}</Text>


                            {/* SECOND TABLE START*/}
                            <View style={{ flexDirection: 'column' }}>

                                <View style={stylesUtilities.table1}>
                                    <View style={Object.assign({}, { width: '98pt' })}>

                                        <Text>{provider}</Text>

                                    </View>
                                    <View style={{ width: '410pt', paddingLeft: 12, fontFamily: 'Cyrillic-Bold', flexDirection: 'column' }}>

                                        <Text style={{ fontFamily: "Cyrillic" }}>{bin} / {iin} {invoice.company_bin}/{invoice.company_iin}, {invoice.company_name}, {invoice.company_address}, {invoice.company_phone}</Text>

                                    </View>

                                </View>

                                <View style={stylesUtilities.table1}>
                                    <View style={Object.assign({}, { width: '98pt' })}>

                                        <Text>{receiver}</Text>

                                    </View>
                                    <View style={{ width: '410pt', paddingLeft: 12, fontFamily: 'Cyrillic-Bold', flexDirection: 'column' }}>

                                        <Text style={{ fontFamily: "Cyrillic" }}>{bin} / {iin} {invoice.owner_bin}/{invoice.owner_iin}, {invoice.owner_name}, {invoice.address}</Text>

                                    </View>

                                </View>

                                <View style={stylesUtilities.table1}>
                                    <View style={Object.assign({}, { width: '98pt' })}>

                                        <Text>{agreement}</Text>

                                    </View>
                                    <View style={{ width: '410pt', paddingLeft: 12, fontFamily: 'Cyrillic-Bold', flexDirection: 'column' }}>

                                        <Text style={{ fontFamily: "Cyrillic" }}>{invoice.agreement} </Text>

                                    </View>

                                </View>

                            </View>

                            {/* SECOND TABLE END*/}

                            {/* THIRD TABLE START  */}

                            <View style={{ flexDirection: 'column' }}>
                                {/* HEADER 508pt */}
                                <View style={stylesUtilities.table3}>
                                    <View style={Object.assign(stylesUtilities.colStyle3, { width: '28pt' })}>
                                        <Text style={{ fontFamily: 'Cyrillic-Bold', textAlign: 'center', paddingTop: '-2pt' }}>{number}</Text>


                                    </View>
                                    <View style={{ width: '200pt', fontSize: 10, textAlign: 'center', fontFamily: 'Cyrillic-Bold', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{name}</Text>

                                    </View>
                                    <View style={{ width: '60pt', fontSize: 10, textAlign: 'center', fontFamily: 'Cyrillic-Bold', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{amount}</Text>
                                    </View>
                                    <View style={{ width: '55pt', fontSize: 10, textAlign: 'center', fontFamily: 'Cyrillic-Bold', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{volume}</Text>
                                    </View>
                                    <View style={{ width: '80pt', fontSize: 10, textAlign: 'center', fontFamily: 'Cyrillic-Bold', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{price}</Text>
                                    </View>
                                    <View style={{ width: '85pt', fontSize: 10, textAlign: 'center', fontFamily: 'Cyrillic-Bold', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{totalPrice}</Text>
                                    </View>

                                </View>


                                {/* ROWS with FOREACH*/}
                                <View style={stylesUtilities.table3Ex}>
                                    <View style={Object.assign(stylesUtilities.colStyle3, { width: '28pt' })}>
                                        <Text style={{ paddingTop: '-2pt' }}>1</Text>

                                    </View>
                                    <View style={{ width: '200pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{payElectricity}</Text>

                                    </View>
                                    <View style={{ width: '60pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>1</Text>
                                    </View>
                                    <View style={{ width: '55pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{ycn}</Text>
                                    </View>
                                    <View style={{ width: '80pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{electricity}</Text>
                                    </View>
                                    <View style={{ width: '85pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{electricity}</Text>
                                    </View>

                                </View>

                                <View style={stylesUtilities.table3Ex}>
                                    <View style={Object.assign(stylesUtilities.colStyle3, { width: '28pt' })}>
                                        <Text style={{ paddingTop: '-2pt' }}>2</Text>

                                    </View>
                                    <View style={{ width: '200pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{payHeating}</Text>

                                    </View>
                                    <View style={{ width: '60pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>1</Text>
                                    </View>
                                    <View style={{ width: '55pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{ycn}</Text>
                                    </View>
                                    <View style={{ width: '80pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{heating}</Text>
                                    </View>
                                    <View style={{ width: '85pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{heating}</Text>
                                    </View>

                                </View>

                                <View style={stylesUtilities.table3Ex}>
                                    <View style={Object.assign(stylesUtilities.colStyle3, { width: '28pt' })}>
                                        <Text style={{ paddingTop: '-2pt' }}>3</Text>

                                    </View>
                                    <View style={{ width: '200pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{payWater}</Text>

                                    </View>
                                    <View style={{ width: '60pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>1</Text>
                                    </View>
                                    <View style={{ width: '55pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{ycn}</Text>
                                    </View>
                                    <View style={{ width: '80pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{water}</Text>
                                    </View>
                                    <View style={{ width: '85pt', fontSize: 10, paddingLeft: '3pt', paddingTop: '3pt', borderRight: '1pt solid black', flexDirection: 'column' }}>
                                        <Text>{water}</Text>
                                    </View>

                                </View>


                            </View>
                            {/* THIRD TABLE END*/}

                            {/* FOURTH TABLE START*/}
                            <View style={{ marginTop: '14' }}>

                                <View style={stylesUtilities.table4}>
                                    <View style={Object.assign(stylesUtilities.colStyle4, { width: '423pt' })}>
                                        <Text style={{ fontFamily: 'Cyrillic-Bold', paddingTop: '-2pt' }}>{totalValue}</Text>
                                    </View>
                                    <View style={{ width: '85pt', fontSize: 10, fontFamily: 'Cyrillic-Bold', paddingTop: '5pt', borderRight: '1pt solid white', flexDirection: 'column' }}>
                                        <Text>{total}</Text>
                                    </View>
                                </View>

                                <View style={stylesUtilities.table4}>
                                    <View style={Object.assign(stylesUtilities.colStyle4, { width: '423pt' })}>
                                        <Text style={{ fontFamily: 'Cyrillic-Bold', paddingTop: '-2pt' }}>{vatAmount}</Text>
                                    </View>
                                    <View style={{ width: '85pt', fontSize: 10, fontFamily: 'Cyrillic-Bold', paddingTop: '5pt', borderRight: '1pt solid white', flexDirection: 'column' }}>
                                        <Text>{tax}</Text>
                                    </View>
                                </View>

                            </View>

                            {/* FOURTH TABLE END*/}

                            {/* FIFTH TABLE START*/}
                            <View style={stylesUtilities.table5}>

                                <View >
                                    <Text>{sumPositions} 3, {price} {total} KZT</Text>
                                </View>

                                <View style={{ fontFamily: 'Cyrillic-Bold', paddingTop: '5pt' }}>
                                    <Text>{forPayment} {total} KZT</Text>
                                </View>

                            </View>

                            {/* FIFTH TABLE END*/}

                            {/* SIXTH TABLE START*/}
                            <View style={{ marginTop: '14', paddingBottom: '10pt' }}>

                                <View style={{ fontSize: '12pt', flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Cyrillic-Bold' }}>{knobnesko} </Text>
                                    <Text style={{ width: '200pt', marginLeft: '10pt', borderBottom: '2pt solid black', marginRight: '5pt' }}></Text>
                                    <Text >{printingTypeSetting}</Text>
                                </View>
                            </View>

                            {/* SIXTH TABLE END*/}

                        </View>
                    </Page>)

                })}
            </Document>

        </>
    );
}

export default PDFGeneratorUtilities;