const CurrencyTable = function ( global ) {
    
    let investAmount    = 0;
    let allCurrencies   = [];
    let fiat            = ['$', 'USD'];
    const c20Index      = [ 13.4, 12.3, 10.5, 10.2, 9.2, 
                            7.6, 5.4, 4.9, 4.3, 4, 
                            3.8, 3.4, 2.1, 1.7, 1.5, 
                            1.5, 1.2, 1.2, 0.9, 0.9 ];

    const currencyChart = document.getElementById( 'currency-chart' );


    /**
     * 
     * @param {currencies} Array array of currencies data  
     */
    function buildTable( currencies ) {
        // Add fiat to thead
        document.querySelectorAll('.fiat').forEach((item) => item.textContent = ` (${fiat[1]})`);
        
        allCurrencies = currencies;
        
        let tbody = document.createElement( 'tbody' );
        let currSymbols = [];
        currencies.forEach( ( cur, coin ) => {
            currSymbols.push(cur.symbol);
            let tr = document.createElement( 'tr' );
            tr.innerHTML = `
                    <td>${ cur.rank }</td>
                    <td><span class="currency-name">${ cur.name}</span> <span class="currency-symbol"> ${cur.symbol} </span></td>
                    <td>${ formatNum( cur.market_cap_usd ) }</td>
                    <td>${ formatNum( cur.price_usd ) }</td>
                    <td>${ c20Index[coin] }%</td>
                    <td>${ calculateInvestment( c20Index[coin] ) }</td>
            `;
            tr.style.cursor = 'pointer';
            tbody.appendChild( tr )  

            tr.addEventListener( 'click', ( e ) => {
                showactiveRow( e );
                currencyChart.innerHTML = '';
                global.chart.getChartData( cur.symbol, cur.name );
                currencyChart.scrollIntoView( { behavior: 'smooth' } );
             } )    

        });
        global.currencyTable.appendChild( tbody );
        global.getNews(currSymbols);
        global.currencySymbol = currSymbols;   
    };


    function showactiveRow( event ) {
        let allActive = document.querySelectorAll( 'tr.active' );
        for( let i = 0 ; i < allActive.length ; i ++ ){
            allActive[i].classList.remove( 'active' );
        }
        event.target.parentNode.classList.add( 'active' );
    }


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
        if( global.input.value !== '' ) {
            investAmount = global.input.value;

            // ===== Remove table body and re-render ===== //
            while (global.currencyTable.childNodes.length > 1) {
                global.currencyTable.removeChild(global.currencyTable.lastChild);
            }
            buildTable( allCurrencies );
        }
    }


    return {
        buildTable,
        formatNum, 
        calculateInvestment,
        submitForm
    }

}