document.addEventListener( 'DOMContentLoaded', () => {

    // ===== Put all DOM targetting here ===== //
    const currencyTable = document.querySelector( '.currency-table' );



    getData( 'https://api.coinmarketcap.com/v1/ticker/?limit=20' )
        .then( res => buildTable( res ) )


    
    function getData( url ) {
        return fetch( url )
                .then( res => res.json() )
    }; 


    /**
     * 
     * @param {currencies} Array array of currencies data  
     */
    function buildTable( currencies ) {
        const tableColumns = [ 'rank', 'name', 'market_cap_usd', 'price_usd', 'percent_change_7d' ]
        let tbody = document.createElement( 'tbody' );
        currencies.forEach( cur => {

            let tr = document.createElement( 'tr');
            tableColumns.forEach( col => {
                let td = document.createElement( 'td' );
                td.textContent = cur[col];
                tr.appendChild(td);
            } )
            tbody.appendChild( tr )
            
        } )
        currencyTable.appendChild(tbody)
    }
} )