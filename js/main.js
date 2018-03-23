document.addEventListener( 'DOMContentLoaded', () => {

    // ===== GLOBALS ===== //
    

    const c20Url  = 'https://api.coinmarketcap.com/v1/ticker/?limit=20';
    const newsUrl = 'https://min-api.cryptocompare.com/data/news/?categories=';

    // number of news articles to show
    const newsLimit = 5;

    // ===== Put all DOM targetting here ===== //
    const currencyTable = document.querySelector( '.currency-table' );
    const form          = document.querySelector( '.invest-form' );
    const input         = document.querySelector( '.invest-input' );
    const newsTable     = document.querySelector( '.news-table' );


    // ===== this variable holds all the functions for currency table ===== //
    const Currency = CurrencyTable( { form, input, currencyTable, getNews } );

    // ===== DOM Listeners ===== // 
    form.addEventListener( 'submit', ( e ) => submitForm( e ) )

    getData(c20Url).then( res => {
        Currency.buildTable( res );
        chart.getChartData( res );
    } )
    
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
            <td><a class="font-weight-bold" href="${info.url}">${info.title}</a> <p>${info.source}</p>
            </td>
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

        getData(fetchUrl).then(res => showNews(res));
    }


    function submitForm( e ) {
        Currency.submitForm( e );
    }
} )
