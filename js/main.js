document.addEventListener( 'DOMContentLoaded', () => {

    // ===== GLOBALS ===== //
    let investAmount    = 0;
    let allCurrencies   = [];
    let fiat            = ['$', 'USD'];
    const index1        = {
        BTC: 13.4, ETH: 12.3, XRP: 10.5, BCH: 10.2, LTC: 9.2, 
        ADA: 7.6, NEO: 5.4, XLM: 4.9, XMR: 4.3, EOS: 4, 
        MIOTA: 3.8, DASH: 3.4, XEM: 2.1, TRX: 1.7, ETC: 1.5, 
        USDT: 1.5, VEN: 1.2, QTUM: 1.2, NANO: 0.9, LSK: 0.9
    };



    // ===== Put all DOM targetting here ===== //
    const currencyTable = document.querySelector( '.currency-table' );
    const form          = document.querySelector( '.invest-form' );
    const input         = document.querySelector( '.invest-input' );


    // ===== DOM Listeners ===== // 
    form.addEventListener( 'submit', ( e ) => submitForm( e ) )




    getData( 'https://api.coinmarketcap.com/v1/ticker/?limit=20' )
        .then( res => buildTable( res ) )


    
    /**
     * 
     * @param {url} String  url string
     * @returns { promise } 
     */
    function getData( url ) {
        return fetch( url )
                .then( res => res.json() )
    }; 

    /**
     * 
     * @param {currencies} Array array of currencies data  
     */
    function buildTable( currencies ) {
        // Add fiat to thead
        document.querySelectorAll('.fiat').forEach((item) => item.textContent = ` (${fiat[1]})`);
       
        allCurrencies = currencies
        const tableColumns = [ 'rank', 'name', 'market_cap_usd', 'price_usd', 'investment' ]
        let tbody = document.createElement( 'tbody' );
        currencies.forEach( cur => {

            let tr = document.createElement( 'tr');
            tableColumns.forEach( col => {
                let td = document.createElement( 'td' );
                let cellData = cur[col]
                
                td.textContent = col === 'investment' 
                    ? calculateInvestment( cur.symbol )
                    : ( col === 'market_cap_usd' || col === 'price_usd' ) 
                        ? formatNum( cellData )
                        : cellData

                tr.appendChild( td );
            } )
            tbody.appendChild( tr )
            
        } )
        currencyTable.appendChild( tbody )
    };


    /**
     * 
     * @param {value} Number from cellData
     * @returns {Number} Formatted with commas and fiat symbol.
     */
    function formatNum( value ) {
        let newNum = parseFloat( value );
        
        // Check for float
        if (newNum % 1 !== 0 && newNum > 1) {
            // Add fiat currency symbol $
            // If price is over 1, limit decimals to two places
            newNum = `${fiat[0]}${newNum.toFixed(2)}`;
            // Add comma after every three numbers
            return newNum = newNum.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        } else if (newNum < 1) {
            return newNum = `${fiat[0]}${newNum}`;
        } else {
            // If market cap, no decimal place
            newNum = `${fiat[0]}${parseInt(newNum)}`;
            return newNum = newNum.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        }
    } 


    /**
     * 
     * @param {value} String currency's symbol value
     * @returns {Number} 
     */
    function calculateInvestment( value ) {
        // ===== Need to figure out the calculations here ===== //
        let amount = investAmount * index1[value] / 100;
        investAmount = investAmount - amount;
        return formatNum( amount ); 
    }



    function submitForm( e ) {
        e.preventDefault();
        if( input.value !== '' ) {
            investAmount = input.value;

            // ===== Remove table body and re-render ===== //
            while (currencyTable.childNodes.length > 1) {
                currencyTable.removeChild(currencyTable.lastChild);
            }
            buildTable( allCurrencies );
        }
    }
} )