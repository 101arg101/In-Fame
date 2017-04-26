"use strict";
window.$logs = true;
window.$networks = [];

function log() {
  if(window.$logs) {
    console.log(arguments)
  }
}

/*
  designed to handle input like this:
  each row is an attribute that is just a value.
  
  attribute1   1234  <- member of team 0
  attribute2   1234
  attribute3   1234
  attribute4   1234
  attribute5   1234
  attribute6   1234
  attribute7   1234
  attribute8   1234
  attribute9   1234
  attribute10  1234
  attribute1   1234  <- member of team 1
  attribute2   1234
  attribute3   1234
  attribute4   1234
  attribute5   1234
  attribute6   1234
  attribute7   1234
  attribute8   1234
  attribute9   1234
  attribute10  1234
  attribute1   1234  <- member of team 0
  attribute2   1234
  attribute3   1234
  attribute4   1234
  attribute5   1234
  attribute6   1234
  attribute7   1234
  attribute8   1234
  attribute9   1234
  attribute10  1234
  attribute1   1234  <- member of team 1
  attribute2   1234
  attribute3   1234
  attribute4   1234
  attribute5   1234
  attribute6   1234
  attribute7   1234
  attribute8   1234
  attribute9   1234
  attribute10  1234
  attribute1   1234  <- member of team 0
  attribute2   1234
  attribute3   1234
  attribute4   1234
  attribute5   1234
  attribute6   1234
  attribute7   1234
  attribute8   1234
  attribute9   1234
  attribute10  1234
  attribute1   1234  <- member of team 1
  attribute2   1234
  attribute3   1234
  attribute4   1234
  attribute5   1234
  attribute6   1234
  attribute7   1234
  attribute8   1234
  attribute9   1234
  attribute10  1234
*/

function startSmiteSession() {
  let key = localStorage.apikey,
      devID = localStorage.devID,
      d = new Date(),
      session = $.get('http://api.smitegame.com/smiteapi.svc/createsessionJSON/'+devID+'/'+key+'/' + d.getFullYear() + (d.getMonth()+1) + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds())
        .done(function startSmiteSessionDone(data) {
          console.log('startSmiteSessionDone', data)
          window.$session = data
        })
        .fail(console.error)
}

function average(ary) {
  let sum = ary.reduce(function(a, b) { return a + b; }),
      n = ary.length,
      mean = sum/n;
  
  return mean
}

function standardDeviation(ary) {
  let sum = ary.reduce(function(a, b) { return a + b; }),
      n = ary.length,
      mean = sum/n,
      
      deviationSum = 0;
  for(let i = 0; i < n; ++i) {
    deviationSum += Math.pow(ary[i] - mean,2)
  }
  return Math.sqrt(deviationSum/n)
}

function createNetwork(data) {
  log('creating network with:', data);
  window.$networks.push(new synaptic.Architect.Perceptron(data.inputs, data.hiddens, data.outputs))
  let network = window.$networks[window.$networks.length - 1],
      _network =
        '<form id="network-{{id}}" class="card network">'+
          '<div class="card-block">'+
            '<div class="card-title"><a>{{id}}</a></div>'+
            '<div class="card-text">'+
              '<div class="input-display">'+
                (function (inputs){
                  let str = '';
                  for(let i = data.inputs; i --> 0;) {
                    str += '<span></span>'
                  }
                  return str
                })()+
              '</div>'+
              '<input type="text" name="inputs" class="inputs form-control" placeholder="inputs">'+
              '<input type="text" name="outputs" class="outputs form-control" placeholder="outputs">'+
              '<div class="output-display">'+
                (function (outputs){
                  let str = '';
                  for(let i = data.outputs; i --> 0;) {
                    str += '<span></span>'
                  }
                  return str
                })()+
              '</div>'+
              '<div class="btn-group" role="group" aria-label="Basic example">' +
                '<button type="submit" class="train btn btn-warning btn-block btn-lg">Train <i class="ion-android-arrow-forward"></i></button>'+
                '<button type="submit" class="run btn btn-primary btn-block btn-lg">Run <i class="ion-android-arrow-forward"></i></button>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</form>';
  let $network = $(Mustache.render(_network, data)),
      $train = $network.find('.train'),
      $run = $network.find('.run');
  //
  $network.data('network', network);
  $train.on('click', trainHandler);
  $run.on('click', runHandler);
  log('network:', network);
  return $network;
}

function fetchHandler(e) {
  e.preventDefault();
  
  colorizeInputs(e, $this)
  colorizeOutputs(e, $this)
}

function addHandler(e) {
  e.preventDefault();
  let $this = $(this),
      $network = $this.parents('.network'),
      $inputs = $network.find('.inputs'),
      $outputs = $network.find('.outputs'),
      inputs = parseInput2($inputs.val()),
      outputs = parseOutput($outputs.val()),
      newSet = {
        input: inputs,
        output: outputs
      },
      trainingSet = $network.data('trainingSet');
  trainingSet.push(newSet)
  $network.data('trainingSet', trainingSet)
  
  colorizeInputs(e, $this)
  colorizeOutputs(e, $this)
}

function trainHandler(e) {
  e.preventDefault();
  let $this = $(this),
      $network = $this.parents('.network');
      
  // pull raw data of network from element
  let network = $network.data('network'),
      trainer = new synaptic.Trainer(network),
      trainingSet = $network.data('trainingSet');
  if(trainingSet.length === 0) { return alert('you need to add a set of inputs & outputs to the training set first') }
  $network.data('trainingSet', trainingSet);
  log(trainer.train(trainingSet, {
    error: .00005
  }));
  network = $network.data('network',network);
  colorizeInputs(e, $this)
  colorizeOutputs(e, $this)
}

function runHandler(e) {
  e.preventDefault();
  let $this = $(this),
      $network = $this.parents('.network'),
      network = $network.data('network'),
      $outputs = $network.find('.outputs'),
      inputs = parseInput2($network.find('.inputs').val()),
      results = network.activate(inputs);
  
  log(inputs)
  log(results)
  
  for(let i = 0; i < results.length; ++i) {
    results[i] = percentToLinear(results[i])
  }
  
  $outputs.val(results.join('\n'))
  colorizeInputs(e, $this)
  colorizeOutputs(e, $this)
}

function colorizeInputs(e, $this) {
  log($this)
  $this = $this ? $this : $(this);
  let $network = $this.parents('.network'),
      $inputs = $network.find('.inputs'),
      inputs = parseInput2($inputs.val());
  $network.find('.input-display span').each(function(i) {
    this.style.backgroundColor = 'rgb(' + Math.ceil((1 - inputs[i])*255) + ', '+ Math.ceil((inputs[i])*255) + ', 0)';
    this.title = (Math.round(inputs[i]*1000)/10) + '%';
    // this.style.opacity = results[i]
  })
}

function colorizeOutputs(e, $this) {
  log($this)
  $this = $this ? $this : $(this);
  let $network = $this.parents('.network'),
      $outputs = $network.find('.outputs'),
      outputs = parseOutput($network.find('.outputs').val());
  $network.find('.output-display span').each(function(i) {
    // displays dots from 0 = red to 1 = green
    this.style.backgroundColor = 'rgb(' + Math.ceil((1 - outputs[i])*255) + ', '+ Math.ceil((outputs[i])*255) + ', 0)';
    this.title = (Math.round(outputs[i]*1000)/10) + '%';
  })
}

function ratiofy(a,b) { // unused function. disregard
  return a/(a + b)
}

function parseInput(data) { // unused function. disregard
  data = data.split('\n');
  let newData = [];
  
  for(let i = 0, item; i < 10; ++i) {
    item = data[i];
    
    if(2 < i && i < 6) {
      newData.push(parseFloat(item.substr(item.indexOf('(')+1)))
    } else if(6 < i && i < 10) {
      newData.push(parseFloat(item.substr(item.indexOf('\t')+2).replace(',','')))
    } else {
      newData.push(parseFloat(item.substr(item.indexOf('\t')+2).replace(',','')))
    }
    
  }
  // 3,4,5 avg
  // 7,8,9 divide
  return newData
}

function parseInputCondense(data) { // unused function. disregard
  
  data = data.split('\n');
  let newData = [],
      teamSize = data.length/20,
      teams = [],
      team = 0;
  
  for(let i = 0, item, j, datum; i < 10; ++i) {
    item = data[i];
    if(i%20 >= 10) { team = 1 } else { team = 0 } // switch between which team we're modifying
    datum = linearToPercent(parseFloat(item.substr(item.indexOf('\t')+2).replace(',','')))
    
    newData[j] = newData[j] ? (newData[j] + datum)/2 : datum;
  }
  
  return newData
}

function parseInput2(data) {
  data = data.trim().split('\n');
  let inputSize = data.length,
      attributes = 10,
      teamSize = inputSize/(attributes*2),
      teams = [[],[]],
      returnable = [];
  
  if(Math.floor(inputSize/(attributes*2)) !== inputSize/(attributes*2)) {
    console.error('invalid input length. Look at command.js for a valid example input')
    return
  }
  for(let i = 0, t; i < attributes*2; ++i) { // for each attribute on both teams
    t = Math.floor(i/attributes)%2;
    teams[t].push([])
    
    for(let j = 0; j < teamSize; ++j) { // for each member
      teams[t][i%attributes].push(linearToPercent(parseFloat(data[i+ attributes*2*j])))
    }
    
    returnable.push(average(teams[t][i%attributes]))
    returnable.push(standardDeviation(teams[t][i%attributes]))
  }
  
  log('parsed input:', returnable)
  return returnable
}

function parseOutput(data) {
  data = data.split('\n')
  let returnable = [];
  
  for(let i = 0, lim = data.length, item; i < lim; ++i) {
    item = data[i];
    returnable.push(linearToPercent(parseFloat(item)))
  }
  
  return returnable
}

function percentToLinear(pO) {
  if (pO === .5) { return 0 } // just a shortcut for performance
  let s = (Math.sign(pO - .5)),
      ss = Math.sign(.5 - (Math.abs(pO - .5) < .25)),
      pP = ((pO - .5)*4 - s),
      lg = -s*ss*(-s/(1 - Math.abs(pP)) + s),
      l = s*Math.pow(Math.E, lg);
  return l
  
  /*
    sgn(y - .5)*e^(-sgn(y - .5)*Piecewise[{{-1, |y| < .25}, {1, |y| >= .25}}]*(-s/(1 - |(y-.5)*4 - sgn(y - .5)| ) + sgn(y - .5)))
  */
}

function linearToPercent(l) {
  if (l === 0) { return .5 }  // just a shortcut for performance
  let lg = Math.log(Math.abs(l)),
      pP = (lg/(Math.abs(lg) + 1)),
      pO = .5 + Math.sign(l)*(pP + 1)/4;
  return pO
  
  // lg = log(|x|)
  // pP = (lg/(|lg|))
          
  // f( x ) = .5 + sgn(x)*(log(x)/(|log(|x|)| + 1) + 1)/4
  // 
}

function init() {
  const smiteNetwork = new synaptic.Architect.Perceptron(
          40, // each team gets averaged into 10 inputs. 20 inputs for both teams, and a standard deviation input for each other input
          40,
          10
          // 0 = team 0 wins, 1 = team 1 wins
          // expected team 0 gold
          // expected team 1 gold
          // expected team 0 kills
          // expected team 1 kills
          // expected team 0 damage
          // expected team 1 damage
        ),
        $s = $('.smite'),
        $fetch = $s.find('.fetch'),
        $add = $s.find('.add'),
        $train = $s.find('.train'),
        $run = $s.find('.run');
  
  $('.generator').on('submit', function(e) {
    e.preventDefault();
    //
    let $this = $(this),
        $inputs  = $this.find('.inputs'),
        $hiddens = $this.find('.hiddens'),
        $outputs = $this.find('.outputs');
    $('.networks.row').append(createNetwork({
      id: "temporary-id",
      inputs:  $inputs.val(),
      hiddens: $hiddens.val(),
      outputs: $outputs.val()
    }))
  });
  
  $fetch.on('click', fetchHandler);
  $add.on('click', addHandler);
  $train.on('click', trainHandler);
  $run.on('click', runHandler);
  
  $s.find('.inputs').on('change', colorizeInputs )
  $s.find('.outputs').on('change',colorizeOutputs)
  
  $s.data('trainingSet', []).data('network', smiteNetwork).on('submit',function(e){e.preventDefault()});
}

function testData() {
  let returnable = {
        input: [],
        output: []
      },
      $inputs = $('.inputs'),
      $outputs = $('.outputs');
  for(let i = 0, x, y, z; i < 10; ++i) {
    x = Math.floor(Math.random()*9)+1
    y = Math.floor(Math.random()*9)+1
    z = Math.pow(10, 0)
    // z = Math.pow(10, Math.floor(Math.random()*5))
    returnable.input[i] = x*z
    returnable.input[i+10] = y*z
    returnable.output.push(x*z - y*z)
  }
  $inputs.val(returnable.input.join('\n'))
  $outputs.val(returnable.output.join('\n'))
}

function test() {
  const $a = $('.add')
  for(let i = 0; i < 20; ++i) {
    testData();
    $a.click();
  }
}

init();