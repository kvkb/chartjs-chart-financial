var response = {
  "title": "High and Low",
  "data": [
      {
          "daypart": "PRIME GAA",
          "network": "AEN",
          "quarter": "Quarter: 1Q2021",
          "releaseWeek": "2021-01-04T00:00:00",
          "high": 366,
          "low": 340,
          "demoCode": "P25-54",
          "budget": 100,
          "lastYear": 690,
          "actEst": 144
      },
      {
          "daypart": "PRIME GAA",
          "network": "HIST",
          "quarter": "Quarter: 1Q2021",
          "releaseWeek": "2021-01-04T00:00:00",
          "high": 387,
          "low": 369,
          "demoCode": "P25-54",
          "budget": 100,
          "lastYear": 438,
          "actEst": 144
      },
      {
          "daypart": "PRIME GAA",
          "network": "LIFE",
          "quarter": "Quarter: 1Q2021",
          "releaseWeek": "2021-01-04T00:00:00",
          "high": 190,
          "low": 172,
          "demoCode": "F25-54",
          "budget": 100,
          "lastYear": 193,
          "actEst": 144
      },
      {
          "daypart": "PRIME GAA",
          "network": "LMN",
          "quarter": "Quarter: 1Q2021",
          "releaseWeek": "2021-01-04T00:00:00",
          "high": 87,
          "low": 70,
          "demoCode": "F25-54",
          "budget": 100,
          "lastYear": 110,
          "actEst": 144
      },
      {
          "daypart": "PRIME GAA",
          "network": "FYI",
          "quarter": "Quarter: 1Q2021",
          "releaseWeek": "2021-01-04T00:00:00",
          "high": 50,
          "low": 40,
          "demoCode": "P25-54",
          "budget": 100,
          "lastYear": 52,
          "actEst": 144
      },
      {
          "daypart": "PRIME GAA",
          "network": "VICE",
          "quarter": "Quarter: 1Q2021",
          "releaseWeek": "2021-01-04T00:00:00",
          "high": 29,
          "low": 13,
          "demoCode": "P18-49",
          "budget": 100,
          "lastYear": 25,
          "actEst": 144
      }
  ]
};

var barCount = 6;
var initialDateStr = '01 Apr 2017 00:00 Z';

var ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = 1000;
ctx.canvas.height = 250;

// var mydata = JSON.parse(response);
var barData =  response.data.map(it => {
  return {
    // x: new Date(),
    o: it.low,
    h: it.budget,
    c: it.high
  }
});


barData = getRandomData(initialDateStr, barCount);

function lineData() { 
  return barData.map(d => { 
    var y = d.h > d.c ? d.h : d.c;
    console.log({ y });
    return { x: d.x, y } 
  });
}

console.log({ barData });
var chart = new Chart(ctx, {
  type: 'candlestick',
  responsive: true,
  maintainAspectRatio: false,
  legend: { display: false },
	data: {
    labels: response.data.map(it => it.network),
		datasets: [{
			// label: 'CHRT - Chart.js Corporation',
			data: barData
		}]
	}
});

var getRandomInt = function(max) {
	return Math.floor(Math.random() * Math.floor(max));
};

function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

function randomBar(date, index) {
  // var open = // response.data[index].
  // randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2);
	// var close = +randomNumber(open * 0.95, open * 1.05).toFixed(2);
	// var high = +randomNumber(Math.max(open, close), Math.max(open, close) * 1.1).toFixed(2);
	// var low = +randomNumber(Math.min(open, close) * 0.9, Math.min(open, close)).toFixed(2);
  console.log(index);
  
  return {
		x: date.valueOf(),
		o: response.data[index].low,
		h: response.data[index].budget,
		l: 0,
		c: response.data[index].high,
	};

}

function getRandomData(dateStr, count) {
	var date = luxon.DateTime.fromRFC2822(dateStr);
	var data = [randomBar(date, 0)];
	while (data.length < count) {
		date = date.plus({days: 1});
		if (date.weekday <= 5) {
			data.push(randomBar(date, data.length));
		}
	}
	return data;
}

var update = function() {
	var dataset = chart.config.data.datasets[0];

	// candlestick vs ohlc
	var type = document.getElementById('type').value;
	dataset.type = type;

	// linear vs log
	var scaleType = document.getElementById('scale-type').value;
  chart.config.options.scales.y.type = scaleType;
  
  dataset.color = {
    up: '#fff',
    down: '#fff',
    unchanged: '#999',
  };
	// color
	var colorScheme = document.getElementById('color-scheme').value;
	if (colorScheme === 'neon') {
		dataset.color = {
			up: '#fff',
			down: '#fff',
			unchanged: '#999',
		};
  } 
  // else {
	// 	delete dataset.color;
	// }

	// border
	var border = document.getElementById('border').value;
	var defaultOpts = Chart.defaults.elements[type];
	if (border === 'true') {
		dataset.borderColor = defaultOpts.borderColor;
	} else {
		dataset.borderColor = {
			up: '#696cff',
			down: '#696cff',
			unchanged: defaultOpts.color.up
		};
	}

	// mixed charts
	var mixed = document.getElementById('mixed').value;
	if(mixed === 'true') {
		chart.config.data.datasets = [
			{
				// label: 'CHRT - Chart.js Corporation',
				data: barData
			},
			{
				label: 'Close price',
				type: 'line',
				data: lineData()
			}	
		]
	}
	else {
		chart.config.data.datasets = [
			{
				// label: 'CHRT - Chart.js Corporation',
				data: barData
			}	
		]
	}

	chart.update();
};

document.getElementById('update').addEventListener('click', update);

document.getElementById('randomizeData').addEventListener('click', function() {
	barData = getRandomData(initialDateStr, barCount);
	update();
});
