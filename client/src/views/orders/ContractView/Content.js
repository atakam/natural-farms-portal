import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '40px',
    textAlign: 'justify',
    textJustify: 'inter-word'
  },
  contractSignature: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '30px'
  },
  contractSignatureBlock: {
    flex: '1 0 50%',
    margin: '15px 0',
    borderBottom: '0.5px solid #CCC',
    textAlign: 'center',
    marginTop: '50px',
    paddingBottom: '20px'
  },
  contractSignatureName: {
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    fontSize: '24px',
    paddingBottom: '10px'
  },
  contractSignatureNameBelow: {
    fontStyle: 'italic',
    fontSize: '12px',
    paddingBottom: '5px'
  },
  contractTopParent: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '30px'
  },
  contractTopChildLabel: {
    flex: '1 0 21%',
    margin: '15px 0',
    fontWeight: '700',
    borderBottom: '1px solid #CCC'
  },
  contractTopChild: {
    flex: '1 0 21%',
    margin: '15px 0',
    borderBottom: '0.5px solid #CCC'
  },
  contractTopChildText: {
    flex: '1 0 21%',
    margin: '15px 0',
    height: '54px',
    borderBottom: '0.5px solid #CCC'
  },
  contractTerms: {
    fontSize: '14px'
  },
  span: {
      fontWeight: '800',
      textDecoration: 'underline'
  },
  contractBottom: {
      marginTop: '60px',
      fontSize: '12px'
  }
}));

const Results = ({ objectProp, printDivId,...rest }) => {
  const classes = useStyles();

  return (
    <div className={classes.root} id={printDivId}>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
        <img style={{width: '80px', position: 'absolute'}} src="https://naturalfarms.ca/wp-content/uploads/2017/03/logo-1.png" />
        <div id="nav2">
            <div style={{textAlign: 'center', width: 'calc(100% - 180px)', margin: '0 auto', borderBottom: '1px solid #CCC', height: '40px', lineHeight: '50px'}}>LA FERME AU NATUREL INC. / NATURAL FARMS INC.</div>
        </div>
        <div style={{borderBottom: '1px solid #CCC', paddingBottom:'10px', marginBottom:'10px'}}>
            <div style={{textAlign: 'center', height: '20px', lineHeight: '20px', fontSize: '14px', marginTop: '8px', wordSpacing: '2px'}}>HST:  818954570 RT 0001 <i className="fa fa-phone"> 1-613-800-2214</i> <i className="fa fa-envelope"> admin@naturalfarms.ca</i></div>
            <div style={{textAlign: 'center', height: '20px', lineHeight: '20px', fontSize: '14px'}}>CONTRAT DE VENTE PAR COMMERCANT ITINERANT</div>
            <div style={{textAlign: 'center', height: '20px', lineHeight: '20px', fontSize: '14px'}}>( Loi sur la protection des consommateurs art. 58 )</div>
        </div>
        <div className={classes.contractTopParent}>
            <div className={classes.contractTopChildLabel}>NFF:</div>
            <div className={classes.contractTopChild}>{objectProp.nff}</div>
            <div className={classes.contractTopChildLabel}>First Name:</div>
            <div className={classes.contractTopChild}>{objectProp.firstName}</div>
            <div className={classes.contractTopChildLabel}>Last Name:</div>
            <div className={classes.contractTopChild}>{objectProp.lastName}</div>
            <div className={classes.contractTopChildLabel}>Email:</div>
            <div className={classes.contractTopChild}>{objectProp.userEmail}</div>
            <div className={classes.contractTopChildLabel}>Phone Number:</div>
            <div className={classes.contractTopChild}>{objectProp.phoneNumber}</div>
            <div className={classes.contractTopChildLabel}>Street Address:</div>
            <div className={classes.contractTopChild}>{objectProp.streetAddress}</div>
            <div className={classes.contractTopChildLabel}>City:</div>
            <div className={classes.contractTopChild}>{objectProp.city + (objectProp.sector != null ? (' (' + objectProp.sector + ')') : '')}</div>
            <div className={classes.contractTopChildLabel}>Province:</div>
            <div className={classes.contractTopChild}>{objectProp.province}</div>
            <div className={classes.contractTopChildLabel}>Postal Code:</div>
            <div className={classes.contractTopChild}>{objectProp.postalCode}</div>
            <div className={classes.contractTopChildLabel}>Total Points:</div>
            <div className={classes.contractTopChild}>{objectProp.total_points}</div>
            <div className={classes.contractTopChildLabel}>Total Price:</div>
            <div className={classes.contractTopChild}>{objectProp.price}</div>
            <div className={classes.contractTopChildLabel}>Rebate:</div>
            <div className={classes.contractTopChild}>{objectProp.rebate}</div>
            <div className={classes.contractTopChildLabel}>Deposit:</div>
            <div className={classes.contractTopChild}>{objectProp.deposit}</div>
            <div className={classes.contractTopChildLabel}>Balance:</div>
            <div className={classes.contractTopChild}>{objectProp.price - objectProp.rebate - objectProp.deposit}</div>
            <div className={classes.contractTopChildLabel}>Mode of Payment:</div>
            <div className={classes.contractTopChild}>{objectProp.cc_flag === 1 ? 'Credit Card' : (objectProp.cash_flag === 1 ? 'Cash' : 'Preauthorized Payment')}</div>
            <div className={classes.contractTopChildLabel}>Notes:</div>
            <div className={classes.contractTopChildText}>{objectProp.notice} <br/> {objectProp.notice2}</div>
        </div>
        <div className={classes.contractTerms}>
            <div className="section dection-100">
                <h3>CONDITIONS:</h3><br/>
                <ol>
                <li>
                    THE PRESENT CONTRACT COVERS A PERIOD OF <span className={classes.span}>{objectProp.conditions_nummonths}</span> MONTHS STARTING ON THE <span className={classes.span}>{moment(objectProp.conditions_startcontractdate).format('DD/MM/YYYY')}</span>. 
                    <br /><br />
                    THE FIRST DELIVERY OF THE GOODS DESCRIBED IN ANNEX 3 WILL BE DELIVERED ON THE <span className={classes.span}>{moment(objectProp.conditions_firstdeliverydate).format('DD/MM/YYYY')}</span>. THE SECOND DELIVERY WILL SUCCEED IN FOUR MONTHS, THE THIRD DELIVERY IN EIGHT MONTHS.<br/>
                    <br/>
                </li>
                <li>
                    TOTAL AMOUNT OF THE AGREEMENT IS <span className={classes.span}>$ {objectProp.price}</span>.<br/><br/>
                </li>
                <li>
                    THE TOTAL AMOUNT OF <span className={classes.span}>$ {objectProp.price}</span> PAYABLE UNDER THIS AGREEMENT, WILL BE ACQUITTED IN <span className={classes.span}>{objectProp.conditions_numwithdrawals}</span> WITHDRAWS FOR THE AMOUNT OF <span className={classes.span}>$ {objectProp.conditions_withdrawalamount}</span> EACH. THE FIRST WITHDRAW WILL BE TAKEN ON THE <span className={classes.span}>{moment(objectProp.conditions_firstwithdrawaldate).format('DD/MM/YYYY')}</span>.
                    <br/><br/>
                </li>
                <li>
                    THE PRE-AUTHORIZED FROM COMPLETED BY THE CONSUMER, IS AN INTEGRAL PART OF THIS AGREEMENT. 
                    <br/><br/>
                </li>
                <li>
                    THE CONSUMER RECOGNIZES THAT THE MERCHANT MAY TAKE THE NECESSARY ACTIONS TO VERIFY THE ACCURACY OF THE INFORMATION ON THE SOLVENCY AND TO COMMUNICATE SUCH INFORMATION TO CREDIT INSTITUTIONS, ALL WITHIN THE LIMITS PERMITTED BY THE ACT.					</li>
                    <br/>
                <li>
                    IF MORE THAN ONE CONSUMER SIGNS THE CONTRACT, THEY JOINTLY AND SEVERALLY FORCE IS TOWARDS THE MERCHANT UNDER THE CONTRACT AGREEMENT. MORE THE CONSUMERS RECOGNIZES THAT THE MERCHANT MUST BE PAID IN FULL FOR THE FULL AMOUNT INDICATE ON THIS CONTRACT, FOR THE FULL TWELVE MONTH PERIOD, EVEN IF THE GOODS DESCRIBED IN ANNEX THREE IS DELIVERED IN TWO DELIVERIES.					</li>
                    <br/>
                <li>
                    IF THE BUYER REFUSES TO RECEIVE A DELIVERY, IT WILL BE AUTOMATICALLY IN DEFAULT AND THEREFORE SHOULD PAY THE MERCHANT PLUS THE TOTAL BALANCE OF HIS DUTY PAYABLE UNDER THIS AGREEMENT, A PENALTY EQUAL TO SURPLUS 20% OF ALL THE SELLING PRICE. IF THE CONTRACT IS EXTENDED BEYOND THE MATURITY DATE OF THE LAST PAYMENT, INTEREST COST OF 2% PER MONTH WILL BE CHARGED ON THE BALANCE UNTIL PAYMENT IS FULLY PAID.						<br />
                    <br/>COUNTERVAILING  CHARGES OF $48, 00 WILL BE PAYABLE FOR SPECIES NOT HONOURED BY THE FINANCIAL INSTITUTION OF THE CONSUMER.					</li>
                    <br/>
                </ol>
                <br />
                <div className="row">
                <div className="space1" /><div className="initials" />
                </div>
                <h3>THE CONSUMER RECOGNIZED THAT:</h3>
                <ol style={{listStyleType: 'upper-alpha'}}>
                    <li>
                        THE MERCHANT HAS FIRST SIGNED TWO COPIES OF THIS AGREEMENT AND THE ANNEXES DULY COMPLETED;					</li>
                    <li>
                        THE MERCHANT THEN GAVE HIM A SIGNED COPY OF THIS AGREEMENT AND THE ANNEXES.   IMPORTANT NOTE:  BIING IMPOSSIBLE TO PRINT, THE ANNEXE THREE (3) DESCRPTION OF THE MERCHADISE ORDERED, THIS ANNEXES IS GIVEN TO THE CUNSUMER(S) ON THE FRIST DELIVERY.					</li>
                    <li>
                        THE MERCHANT ALLOWED HIM TO READ THE TERMS AND PROVIDED ADEQUATE EXPLANATIONS ON THE SCOPE AND EXTENT OF THE TERMS OF THIS AGREEMENT;					</li>
                    <li>
                        IT HAS SIGNED TWO COPIES OF THE CONTRACT, HAS RETAINED ONE AND GAVE THE OTHER TO THE FOOD CONSULTANT					</li>
                    <li>
                        THE MERCHANT WILL SEND A COPY OF THE SHEET COMMAND.					</li>
                </ol>
            </div>
        </div>
        <div className={classes.contractBottom}>
            <h5>THE CONSUMER RECOGNIZED THAT:</h5>
            <b><i>Resolution of the consumer rights statement</i></b><br /><br />
            <i>(Act on the protection of the consumer, S.58)</i><br /><br />
            You can resolve this contract for any reason, for a period of 10 days after receipt of the double of the contract and the documents that needs to be appended.			<br /><br />
            If you do not receive goods or service within 30 days of a date specified in the contract, you have 1 year to rescind the contract. However, you lose this right of resolution if you accept the delivery after this 30 day period. The time of exercise of the right of resolution may also be increased to 1 year for other reasons, including for lack permits, for absence or disability of bail, for lack of delivery or non-conformity of the contract. For more information, contact a legal adviser or the Office of consumer protection.			<br /><br />
            When the contract is resolved, the itinerant trader should you repay all monies you have paid and return you anything although it received payment, in Exchange or deposit; if it can render this property, the itinerant trader must give a sum corresponding to the price of this well indicated in the contract or, failing that, the value of this property within 15 days of the resolution. In the same period, you must submit to the itinerant trader the property that you received from the merchant. To resolve the contract sufficiently, either to the proprietor or his representative that you received the merchandise from, you will need to return the form below or send him another notice to this effect. The form or notice must be sent to the proprietor or his representative, the address indicated on the form or another proprietor or representative address indicated in the contract. The notice must be delivered in person or be given by any other means enabling the consumer to prove its shipment: by registered mail, by e-mail, by fax or by courier.						
        </div>

        <div className={classes.contractSignature}>
            <div className={classes.contractSignatureBlock}>
                <div className={classes.contractSignatureName}>{objectProp.signature_consumer_name}</div>
                <div className={classes.contractSignatureNameBelow}>(Electronically signed)</div>
                <div>{objectProp.signature_address}</div>
                <div>{moment(objectProp.signature_date).format('DD/MM/YYYY')}</div>
            </div>
            <div className={classes.contractSignatureBlock}>
                <div className={classes.contractSignatureName}>{objectProp.signature_merchant_name}</div>
                <div className={classes.contractSignatureNameBelow}>(Electronically signed)</div>
                <div>{objectProp.signature_address}</div>
                <div>{moment(objectProp.signature_date).format('DD/MM/YYYY')}</div>
            </div>
        </div>
    </div>
        
  );
};

Results.propTypes = {
  className: PropTypes.string
};

export default Results;
