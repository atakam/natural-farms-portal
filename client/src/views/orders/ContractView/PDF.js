import React, {useEffect, useState, useRef} from 'react';
import Content from './Content';
import html2pdf from 'html2pdf.js'

const PDF = ({formid, closeDialog}) => {
    const [objectProp, setForm] = useState(null);

    const getContract = async () => {
        const response = await fetch('/form/' + formid, {
            headers: {
              'Content-Type': 'application/json',
            }
        });
        const body = await response.text();
        const result = JSON.parse(body);
        console.log("results", JSON.parse(body));
        let obj = result[0];
        if (obj) {
            obj = {
                ...obj,
                formid: obj.formid,
                rid: obj.representative_id,
                email: obj.email,
                phoneNumber: obj.phoneNumber,
                name: obj.firstName + ' ' + obj.lastName,
                nff: obj.nff,
                id: obj.uid,
                isEditAllowed: obj.signature_consumer_name !== '' && obj.signature_merchant_name !== ''
            };
        }
        setForm(obj);
    };

    useEffect(() => {
        getContract();
    }, [formid]);

    useEffect(() => {
        if (objectProp) {
            closeDialog && closeDialog(false);
            const element = document.getElementById('printDiv');
            const opt = {
                margin:       [0.3, 0.3, 0.3, 0.1],
                filename:     objectProp.firstName + objectProp.lastName + '-Contract_' + objectProp.signature_date.split('T')[0],
                html2canvas:  { scale: 1 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        }
    })

    return (objectProp ?
        <Content objectProp={objectProp} printDivId={'printDiv'} />
        : 'Form not found to Download');
};

export default PDF;