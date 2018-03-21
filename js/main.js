document.addEventListener( 'DOMContentLoaded', () => {

    // ===== GLOBALS ===== //
    let investAmount    = 0;
    let allCurrencies   = [];
    let fiat            = ['$', 'USD'];
    const c20Index      = [ 13.4, 12.3, 10.5, 10.2, 9.2, 
                            7.6, 5.4, 4.9, 4.3, 4, 
                            3.8, 3.4, 2.1, 1.7, 1.5, 
                            1.5, 1.2, 1.2, 0.9, 0.9 ];



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
       
        allCurrencies = currencies;
        let tbody = document.createElement( 'tbody' );
        currencies.forEach( ( cur, coin ) => {

            let tr = document.createElement( 'tr' );
            tr.innerHTML = `
                    <td>${ cur.rank }</td>
                    <td>${ cur.name }</td>
                    <td>${ formatNum( cur.market_cap_usd ) }</td>
                    <td>${ formatNum( cur.price_usd ) }</td>
                    <td>${ c20Index[coin] }%</td>
                    <td>${ calculateInvestment( c20Index[coin] ) }</td>
            `;
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
     * @param {value} Number currency's index percentage
     * @returns {Number} 
     */
    function calculateInvestment( value ) {
        // ===== Need to figure out the calculations here ===== //
        let amount = investAmount * value / 100;
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