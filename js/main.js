document.addEventListener( 'DOMContentLoaded', () => {

    // ===== GLOBALS ===== //
    let investAmount    = 0;
    let allCurrencies   = [];


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
        const tableColumns = [ 'rank', 'name', 'market_cap_usd', 'price_usd', 'percent_change_7d', 'investment' ]
        let tbody = document.createElement( 'tbody' );
        currencies.forEach( cur => {

            let tr = document.createElement( 'tr');
            tableColumns.forEach( col => {
                let td = document.createElement( 'td' );
                td.textContent = col === 'investment' 
                                    ? calculateInvestment( investAmount )
                                    : cur[col]

                tr.appendChild( td );
            } )
            tbody.appendChild( tr )
            
        } )
        currencyTable.appendChild( tbody )
    };


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