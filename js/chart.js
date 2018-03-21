
const chart = ( function () {

    let labels   = ["January", "February", "March", "April", "May", "June", "July"];
    let datasets = [];
    

    function getChartData ( chartData ){

        let currencies = chartData.filter( ( cd, index ) => index <= 9 );

        Promise.all( currencies.map( cd => {
            return fetch( `https://cors-anywhere.herokuapp.com/https://min-api.cryptocompare.com/data/histoday?fsym=${cd.symbol}&tsym=USD&limit=6` )
                    .then( res => res.json() )
        } ) )
        .then( res => {

            res.forEach( ( data, index ) => {
                let closingPrices = [];
                data.Data.forEach( d => closingPrices.push( d.close ) )
                datasets.push( {
                    label: currencies[index].symbol,
                    backgroundColor: 'transparent',
                    borderColor: getRandomColor(),
                    data: closingPrices,
                } )
             } )

             buildChart();
        } )
    }


    function buildChart() {
        const ctx = document.getElementById('currency-chart').getContext('2d');
        const chart = new Chart(ctx, {
            // he type of chart we want to create
            type: 'line',
    
            // The data for our dataset
            data: {
                labels,
                datasets
            },
    
            // Configuration options go here
            options: {}
        } )
    }


    function getRandomColor() {
        return `rgba(${getRandom()}, ${getRandom()}, ${getRandom()}, 0.8)`;
    }


    function getRandom() {
        return Math.floor(Math.random() * 256).toString();
    }


    return {
        getChartData
    }
} )()

