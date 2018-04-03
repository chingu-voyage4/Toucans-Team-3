document.addEventListener( 'DOMContentLoaded', () => {

    // ===== GLOBALS ===== //
    

    const c20Url  = 'https://api.coinmarketcap.com/v1/ticker/?limit=20';
    const newsUrl = 'https://min-api.cryptocompare.com/data/news/?categories=';
    let currencySymbols = [];

    // number of news articles to show
    const newsLimit = 5;
    let firstArticle = 0;
    let lastArticle = newsLimit;

    // ===== Put all DOM targetting here ===== //
    const currencyTable = document.querySelector( '.currency-table' );
    const form          = document.querySelector( '.invest-form' );
    const input         = document.querySelector( '.invest-input' );
    const newsTable     = document.querySelector( '.news-table' );
    const refreshButton = document.querySelector( '.refresh-icon' );
    const nav           = document.querySelector('#nav-main');


    // ===== this variable holds all the functions for currency table ===== //
    const Currency = CurrencyTable( { form, input, currencyTable, getNews, currencySymbols, chart } );

    // ===== DOM Listeners ===== // 
    form.addEventListener( 'submit', ( e ) => submitForm( e ) );
    refreshButton.addEventListener( 'click', () => getNews( currencySymbols ) )
    window.addEventListener('scroll', fixNav);



    getData(c20Url).then( res => {
        Currency.buildTable( res );
        chart.getChartData( 'BTC', 'Bitcoin' );
    } )



function fixNav() {
    const topOfNav      = nav.offsetTop;


    if (window.scrollY >= topOfNav) {
        document.body.style.paddingTop = nav.offsetHeight + 'px';
        document.body.classList.add('fixed-nav');
    } else {
        document.body.style.paddingTop = 0;
        document.body.classList.remove('fixed-nav');
    }            
}

    
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
        // If user refreshes news, pull new batch
        // When user cycles 5 times, start again
        if (lastArticle >= newsLimit * 5) {
            firstArticle = 0;
            lastArticle = newsLimit;
        } else {
            firstArticle += newsLimit;
            lastArticle += newsLimit;
        }
        let articlesSample = articles.slice(firstArticle, lastArticle);  
        let tbody = document.createElement( 'tbody' );
 
        // if newstable is already present, clear before
        // appending
        if (newsTable !== null) {
            newsTable.innerHTML = '';
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
        refreshButton.children[0].classList.add('spin-animation');
            setTimeout(function(){
        	    refreshButton.children[0].classList.remove('spin-animation');
            }, 500);

        fetchUrl = newsUrl.concat(currString);

        getData(fetchUrl).then(res => showNews(res));
    }


    function submitForm( e ) {
        Currency.submitForm( e );
    }
} )
