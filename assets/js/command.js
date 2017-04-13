"use strict";

function createNetwork(data) {
  var network = new Architect.Perceptron(data.inputs, data.hiddens, data.outputs),
      _network =
        '<form id="network-{{id}}" class="card network">'+
          '<div class="card-block">'+
            '<div class="card-title"><a>{{id}}</a></div>'+
            '<div class="card-text">'+
              '<input type="text" name="inputs" class="inputs form-control" placeholder="inputs">'+
              '<input type="text" name="outputs" class="outputs form-control" placeholder="outputs">'+
              '<div class="btn-group" role="group" aria-label="Basic example">'
                '<button type="submit" class="train btn btn-warning btn-block btn-lg">Train <i class="ion-android-arrow-forward"></i></button>'+
                '<button type="submit" class="run btn btn-primary btn-block btn-lg">Run <i class="ion-android-arrow-forward"></i></button>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</form>',
      $network = $(Mustache.render(_network, data)),
      $train = $network.find('.train'),
      $run = $network.find('.run');
  //
  $network.data('network', network);
  $train.on('click', trainHandler);
  $run.on('click', runHandler);
  
  return $network;
}

trainHandler(e) {
  e.preventDefault();
  var $this = $(this),
      $network = $this.parent('.network'),
      network = $network.data('network'),
      trainer = new Trainer(network),
      trainingSet = [
        {
          input: $network.find('.inputs').val().split(','),
          output:  $network.find('.outputs').val().split(',')
        }
      ];
  
  trainer.train(trainingSet).then(results => console.log('done!', results))
}

trainHandler(e) {
  e.preventDefault();
  var $this = $(this),
      $network = $this.parent('.network'),
      network = $network.data('network'),
      inputs = $network.find('.inputs').val().split(',')
      $outputs = $network.find('.outputs');
  
  $outputs.val(network.activate(inputs).join(','))
}

function init() {
  $('.generator').on('submit',function(e) {
    e.preventDefault();
    //
    var $this = $(this);
        $inputs  = $this.find('.inputs'),
        $hiddens = $this.find('.hiddens'),
        $outputs = $this.find('.outputs');
    $('.networks.row').append(createNetwork({
      id: "temporary-id"
      inputs:  $inputs.val(),
      hiddens: $hiddens.val(),
      outputs: $outputs.val()
    }))
  })
}