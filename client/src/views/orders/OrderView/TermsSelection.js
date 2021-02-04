import React, {useState} from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Checkbox,
  Typography
} from '@material-ui/core';

const TermsSelection = ({ className, termsDetails, setTermsDetails, results, ...rest }) => {
    const [details, setDetails] = useState(termsDetails);

    return (
        <PerfectScrollbar>
            <Box minWidth={1050}>
                <strong>THE CONSUMER RECOGNIZED THAT:</strong><br/><br/>

                THE MERCHANT HAS FIRST SIGNED TWO COPIES OF THIS AGREEMENT AND THE ANNEXES DULY COMPLETED;<br/>
                THE MERCHANT THEN GAVE HIM A SIGNED COPY OF THIS AGREEMENT AND THE ANNEXES. IMPORTANT NOTE: BIING IMPOSSIBLE TO PRINT, THE ANNEXE THREE (3) DESCRPTION OF THE MERCHADISE ORDERED, THIS ANNEXES IS GIVEN TO THE CUNSUMER(S) ON THE FRIST DELIVERY.<br/>
                THE MERCHANT ALLOWED HIM TO READ THE TERMS AND PROVIDED ADEQUATE EXPLANATIONS ON THE SCOPE AND EXTENT OF THE TERMS OF THIS AGREEMENT;<br/>
                IT HAS SIGNED TWO COPIES OF THE CONTRACT, HAS RETAINED ONE AND GAVE THE OTHER TO THE FOOD CONSULTANT<br/>
                THE MERCHANT WILL SEND A COPY OF THE SHEET COMMAND.<br/>
                <br/>
                <strong>THE CONSUMER RECOGNIZED THAT:</strong><br/>
                <br/>
                Resolution of the consumer rights statement<br/>
                <br/>
                (Act on the protection of the consumer, S.58)<br/>
                <br/>
                You can resolve this contract for any reason, for a period of 10 days after receipt of the double of the contract and the documents that needs to be appended.<br/>
                <br/>
                If you do not receive goods or service within 30 days of a date specified in the contract, you have 1 year to rescind the contract. However, you lose this right of resolution if you accept the delivery after this 30 day period. The time of exercise of the right of resolution may also be increased to 1 year for other reasons, including for lack permits, for absence or disability of bail, for lack of delivery or non-conformity of the contract. For more information, contact a legal adviser or the Office of consumer protection.<br/>
                <br/>
                When the contract is resolved, the itinerant trader should you repay all monies you have paid and return you anything although it received payment, in Exchange or deposit; if it can render this property, the itinerant trader must give a sum corresponding to the price of this well indicated in the contract or, failing that, the value of this property within 15 days of the resolution. In the same period, you must submit to the itinerant trader the property that you received from the merchant. To resolve the contract sufficiently, either to the proprietor or his representative that you received the merchandise from, you will need to return the form below or send him another notice to this effect. The form or notice must be sent to the proprietor or his representative, the address indicated on the form or another proprietor or representative address indicated in the contract. The notice must be delivered in person or be given by any other means enabling the consumer to prove its shipment: by registered mail, by e-mail, by fax or by courier.
            </Box>
            <Box
                alignItems="center"
                display="flex"
                ml={-1}
            >
                <Checkbox
                    checked={details.policy}
                    name="policy"
                    onChange={(e) => {
                        const newDetails = {
                            policy: e.currentTarget.checked
                        };
                        setDetails(newDetails);
                        setTermsDetails(newDetails);
                    }}
                />
                <Typography
                    color="textSecondary"
                    variant="body1"
                >
                    I have read the Terms and Conditions
                </Typography>
            </Box>
        </PerfectScrollbar>
  );
};

TermsSelection.propTypes = {
  className: PropTypes.string
};

export default TermsSelection;
