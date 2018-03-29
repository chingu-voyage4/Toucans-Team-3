
const chart = ( function () {

    let labels   = ["January", "February", "March", "April", "May", "June", "July"];
    let datasets = [];
    

    function getChartData ( currency ){

        labels   = [];
        datasets = [];

        // let currencies = chartData.filter( ( cd, index ) => index <= 9 );

        // Promise.all( currencies.map( cd => {
            return fetch( `https://cors-anywhere.herokuapp.com/https://min-api.cryptocompare.com/data/histoday?fsym=${currency}&tsym=USD&limit=6` )
                    .then( res => res.json() )
        // } ) )
        .then( res => {

            // res.forEach( ( data, index ) => {
                let closingPrices = [];
                res.Data.forEach( d => {
                    closingPrices.push( d.close );
                    labels.push( d.time )
                 } )
                let lineColor = getRandomColor()
                datasets.push( {
                    label: currency,
                    backgroundColor: 'transparent',
                    borderColor: lineColor,
                    borderWidth: 4.5,
                    pointBackgroundColor: lineColor,
                    pointRadius: 5,	
                    pointHoverRadius: 8,
                    data: closingPrices,
                } )
                console.log( datasets)
            //  } )

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
            options: {
                responsive:true,
                maintainAspectRatio:false
            }
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
