
const chart = ( function () {

    let labels   = ["January", "February", "March", "April", "May", "June", "July"];
    let datasets = [];
    

    function getChartData ( curSymbol, curName ){

        labels   = [];
        datasets = [];

        return fetch( `https://cors-anywhere.herokuapp.com/https://min-api.cryptocompare.com/data/histoday?fsym=${curSymbol}&tsym=USD&limit=6` )
                .then( res => res.json() )
                .then( res => {
                    
                    // ===== Check for Empty Data ===== //
                
                    let closingPrices = [];
                    res.Data.forEach( d => {
                        closingPrices.push( d.close );
                        labels.push( d.time )
                     } )
                    let lineColor = getRandomColor()
                    datasets.push( {
                        label: curName,
                        backgroundColor: 'transparent',
                        borderColor: 'rgba( 0, 0, 0, 0.7)',
                        borderWidth: 3,
                        pointBackgroundColor: '#66ff66',
                        pointRadius: 5,	
                        pointHoverRadius: 8,
                        data: closingPrices,
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
            options: {
                responsive:true,
                maintainAspectRatio:false,
                scales: {
                    yAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: 'Price in USD',
                        fontSize: 20
                      }
                    }],
                    xAxes: [{
                        scaleLabel: {
                          display: true,
                          labelString: 'Day',
                          fontSize: 20
                        }
                      }]
                  } 
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
