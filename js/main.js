document.addEventListener( 'DOMContentLoaded', () => {

    // ===== GLOBALS ===== //
    let investAmount    = 0;
    let allCurrencies   = [];
    let fiat = ['$', 'USD'];


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
        allCurrencies = currencies
        const tableColumns = [ 'rank', 'name', 'market_cap_usd', 'price_usd', 'investment' ]
        let tbody = document.createElement( 'tbody' );
        currencies.forEach( cur => {

            let tr = document.createElement( 'tr');
            tableColumns.forEach( col => {
                let td = document.createElement( 'td' );   
                let cellData = cur[col]
                
                // is the column for investment? 
                // if yes, calculate investment for columnif not, is the column for market cap or price?
                td.textContent = col === 'investment' 
                    ? calculateInvestment( investAmount )
                    : ( col === 'market_cap_usd' || col === 'price_usd' ) ? formatNum( cellData )
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
     * @param {value} Number 
     * @returns {Number} 
     */
    function calculateInvestment( value ) {
        // ===== Need to figure out the calculations here ===== //
        return value * 2; 
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