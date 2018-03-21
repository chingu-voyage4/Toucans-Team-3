document.addEventListener( 'DOMContentLoaded', () => {

    // ===== GLOBALS ===== //
    let investAmount    = 0;
    let allCurrencies   = [];
    let fiat            = ['$', 'USD'];
    const c20Index      = [ 13.4, 12.3, 10.5, 10.2, 9.2, 
                            7.6, 5.4, 4.9, 4.3, 4, 
                            3.8, 3.4, 2.1, 1.7, 1.5, 
                            1.5, 1.2, 1.2, 0.9, 0.9 ];

    const c20Url = 'https://api.coinmarketcap.com/v1/ticker/?limit=20';

    const newsUrl = 'https://min-api.cryptocompare.com/data/news/?categories=';

    // number of news articles to show
    const newsLimit = 5;

    // ===== Put all DOM targetting here ===== //
    const currencyTable = document.querySelector( '.currency-table' );
    const form          = document.querySelector( '.invest-form' );
    const input         = document.querySelector( '.invest-input' );
    const newsTable = document.querySelector( '.news-table' );


    // ===== DOM Listeners ===== // 
    form.addEventListener( 'submit', ( e ) => submitForm( e ) )

    getData(c20Url).then( res => buildTable( res ) )
    
    /**
     * 
     * @param {url} String  url string
     * @returns { promise } 
     */
    function getData( url ) {
        return fetch( url )
                .then( res => res.json() )
    }; 

    function showNews(articles) {
        let articlesSample = articles.slice(0, newsLimit);  
        let tbody = document.createElement( 'tbody' );
        tbody.setAttribute("id", "newstable");
 
        // if newstable is already present, clear before
        // appending
        let newsBody = document.querySelector('#newstable');
        if (newsBody !== null) {
            newsBody.innerHTML = '';
        }
 
        articlesSample.forEach((info) => {
            let tr = document.createElement( 'tr' );
            tr.innerHTML = `
            <td><img src="${info.imageurl}" title=${info.title}" alt="news"/></td>
            <td><p></p><a href="${info.url}">${info.title}</a></p>
            <p>${info.body}</p></td>
            `;
            tbody.appendChild( tr );
        })
        newsTable.appendChild( tbody );
    }

    /** 
     * construct news based on top 20 crypto
     * @param {currSymbol} Array currencysymbols
     * eg: ['BTC', 'ETH']
    */
    function getNews(currSymbols) {
        let currString = currSymbols.join(",");
        
        fetchUrl = newsUrl.concat(currString);
        console.log(fetchUrl);

        getData(fetchUrl).then(res => showNews(res));
    }

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
                    <td>${ cur.name }</td>
                    <td>${ formatNum( cur.market_cap_usd ) }</td>
                    <td>${ formatNum( cur.price_usd ) }</td>
                    <td>${ c20Index[coin] }%</td>
                    <td>${ calculateInvestment( c20Index[coin] ) }</td>
            `;
            tbody.appendChild( tr )      
        });
        getNews(currSymbols);
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
