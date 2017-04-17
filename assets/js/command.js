"use strict";
window.$logs = true;
window.$networks = [];

function log() {
  if(window.$logs) {
    console.log(arguments)
  }
}

function createNetwork(data) {
  log('creating network with:', data);
  window.$networks.push(new synaptic.Architect.Perceptron(data.inputs, data.hiddens, data.outputs))
  var network = window.$networks[window.$networks.length - 1],
      _network =
        '<form id="network-{{id}}" class="card network">'+
          '<div class="card-block">'+
            '<div class="card-title"><a>{{id}}</a></div>'+
            '<div class="card-text">'+
              '<div class="input-display">'+
                (function (inputs){
                  var str = '';
                  for(var i = data.inputs; i --> 0;) {
                    str += '<span></span>'
                  }
                  return str
                })()+
              '</div>'+
              '<input type="text" name="inputs" class="inputs form-control" placeholder="inputs">'+
              '<input type="text" name="outputs" class="outputs form-control" placeholder="outputs">'+
              '<div class="output-display">'+
                (function (outputs){
                  var str = '';
                  for(var i = data.outputs; i --> 0;) {
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
  var $network = $(Mustache.render(_network, data)),
      $train = $network.find('.train'),
      $run = $network.find('.run');
  //
  $network.data('network', network);
  $train.on('click', trainHandler);
  $run.on('click', runHandler);
  log('network:', network);
  return $network;
}

function trainHandler(e) {
  e.preventDefault();
  var $this = $(this),
      $network = $this.parents('.network');
      
  if(!$network.data('trainingSet')) {
    $network.data('trainingSet', [])
  }
  
  // pull raw data of network from element
  var network = $network.data('network'),
      trainer = new synaptic.Trainer(network),
      trainVal = {
        input: $network.find('.inputs').val().split(','),
        output:  $network.find('.outputs').val().split(',')
      },
      rawSet = $network.data('trainingSet'),
      trainingSet = rawSet ? rawSet : [];
  
  trainingSet.push(trainVal);
  $network.data('trainingSet', trainingSet);
  var results = trainer.train(trainingSet);
}

function runHandler(e) {
  e.preventDefault();
  var $this = $(this),
      $network = $this.parents('.network'),
      network = $network.data('network'),
      
      inputs = $network.find('.inputs').val().split(','),
      $outputs = $network.find('.outputs'),
      results = network.activate(inputs);
  
  $outputs.val(results.join(','))
  $network.find('.output-display span').each(function(i){
    this.style.backgroundColor = 'rgb(' + Math.ceil((1 - results[i])*255) + ', '+ Math.ceil((results[i])*255) + ', 0)'
    // this.style.opacity = results[i]
  })
  $network.find('.input-display span').each(function(i){
    this.style.backgroundColor = 'rgb(' + Math.ceil((1 - inputs[i])*255) + ', '+ Math.ceil((inputs[i])*255) + ', 0)'
    // this.style.opacity = results[i]
  })
}

function init() {
  $('.generator').on('submit',function(e) {
    e.preventDefault();
    //
    var $this = $(this),
        $inputs  = $this.find('.inputs'),
        $hiddens = $this.find('.hiddens'),
        $outputs = $this.find('.outputs');
    $('.networks.row').append(createNetwork({
      id: "temporary-id",
      inputs:  $inputs.val(),
      hiddens: $hiddens.val(),
      outputs: $outputs.val()
    }))
  })
}

init()