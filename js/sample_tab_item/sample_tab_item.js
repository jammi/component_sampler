var
SampleTabItem = HClass.extend({
  constructor: function(_tab,_options){
    
    /* Creates tab item: */
    var _tabItem = HTabItem.nu(_tab,_options);
    
    /* Description: */
    this.descriptionView = HStringView.nu(
      [ 8, 8, null, _options.descr_height, 8, null ],
      _tabItem, {
        value: '<h1>'+_options.label+'</h1>'+_options.descr
      }
    );
    
    ELEM.flushLoop();
    var
    _descrHeight = ELEM.getSize(this.descriptionView.markupElemIds.value)[1],
    _sampleTop = _options.descr_height+42,
    _sampleHeight = (_options.sample_height > _options.yaml_height)?_options.sample_height:_options.yaml_height;
    
    /* Sample Label: */
    HLabel.nu(
      [ 8, _sampleTop-16, null, 20, 8, null ],
      _tabItem, {
        label: 'Visual sample:',
        style: { fontWeight: 'bold' }
      }
    );
    
    /* YAML Source label: */
    HLabel.nu(
      [ null, _sampleTop-16, 400, 20, 8, null ],
      _tabItem, {
        label: 'YAML source:',
        style: { fontWeight: 'bold' }
      }
    );
    
    /* YAML Source: */
    HTextArea.nu(
      [ null, _sampleTop, 400, _sampleHeight, 8, null ],
      _tabItem, {
        value: _options.yaml
      }
    );
    
    /* Sample Viewer area */
    COMM.Queue.push(
      function(_json,_sampleTop,_sampleHeight,_tabItem){
        // debugger;
        JSONRenderer.nu(
          _json,
          SampleView.nu(
            [ 8, _sampleTop, null, _sampleHeight, 416, null ],
            _tabItem
          )
        );
      },
      [_options.json,
      _sampleTop,
      _sampleHeight,
      _tabItem]
    );
    
    return _tabItem;
  }
});

