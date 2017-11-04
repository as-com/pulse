const socket = io("10.105.244.113:3000")

socket.on('words', function(words) {
    
    document.getElementById('words').innerHTML = words

    var table = ''
    for (var i = 0; i < words.length; i++) {
        table += '<div class="ui segment"><p>' + words[i] + '</p></div>'
    }

    document.getElementById('trending-table').innerHTML = table
})

var bar;

function updateProgress(progress) {
      
}

$(document).ready(function () {
    var ctx = document.getElementById("toxicity-chart").getContext("2d")
    // $('toxicity-chart').css({
    //     "width": window.innerWidth
    // })

    var data = {
        "labels": [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ],
        "datasets": [
            {
                "label": "Reddit",
                "data": [ ],
                // "fill": 1,
                "borderColor": "rgb(29, 185, 85)",
                "backgroundColor": "rgba(29, 185, 85, 0.3)",
                "lineTension": 0.1
            },
            {
                "label": "Twitter",
                "data": [ ],
                // "fill": 'origin',
                "borderColor": "rgb(75, 192, 192)",
                "backgroundColor": "rgba(75, 192, 192, 0.3)",                
                "lineTension": 0.1
            }
        ],
        "options": {
            "plugins": {
                "filler": {
                    "propagate": true
                }
            },
            "scales": {
                "yAxes": [{
                    "stacked": true
                }]
            }
        }
    }
    var liveLineChart = new Chart(ctx, {
        "type": "line",
        "data": data,
        "options": {
            steppedLine: false
        }
    })
    var latestLabel = 0


    var bar = new ProgressBar.SemiCircle(document.getElementById('toxicity-moon'), {
        strokeWidth: 6,
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 200,
        svgStyle: null,
        text: {
          value: '',
          alignToBottom: false
        },
        from: {color: '#FFEA82'},
        to: {color: '#ED6A5A'},
        // Set default step function for all animate calls
        step: (state, bar) => {
          bar.path.setAttribute('stroke', state.color)
          var value = Math.round(bar.value() * 200)
          if (value === 0) {
            bar.setText('')
          } else {
            bar.setText(value)
          }
      
          bar.text.style.color = state.color
        }
    })

    socket.on('rate', function(rate) {
        if (data.datasets[0].data.length > 20) {
            data.datasets[0].data.shift()
            data.datasets[1].data.shift()
            // data.labels.pop()
        }
        data.datasets[1].data.push(rate['twitter'])
        data.datasets[0].data.push(rate['reddit'])
        // data.labels.push("")
        liveLineChart.update()        
        
        bar.animate(rate['total'] / 200);
    })
})