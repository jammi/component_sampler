SampleTabItem = HClass.extend({
  constructor: function(_rect,_tab,_options){
    
    /* Creates tab item: */
    var _tabItem = HTabItem.nu(_rect,_tab,_options);
    
    /* Description: */
    this.descriptionView = HStringView.nu(
      [ 8, 8, null, _options.descr_height, 8, null ],
      _tabItem, {
        value: '<h1>'+_options.label+'</h1>'+_options.descr
      }
    );
    
    ELEM.flushLoop();
    var _descrHeight = ELEM.getSize(this.descriptionView.markupElemIds.value)[1];
    console.log('descrHeight',_descrHeight);
    
    var _sampleTop = _options.descr_height+42,
        _sampleHeight = (_options.sample_height > _options.yaml_height)?_options.sample_height:_options.yaml_height;
    
    /* Sample Label: */
    HStringView.nu(
      [ 8, _sampleTop-16, null, 20, 8, null ],
      _tabItem, {
        value: '<b>Visual sample:</b>'
      }
    );
    
    /* YAML Source label: */
    HStringView.nu(
      [ null, _sampleTop-16, 400, 20, 8, null ],
      _tabItem, {
        value: '<b>YAML source:</b>'
      }
    );
    
    /* YAML Source: */
    HTextArea.nu(
      [ null, _sampleTop, 400, _sampleHeight, 8, null ],
      _tabItem, {
        value: _options.yaml
      }
    );
    
    var _patternUrl = _tab.app.options.checker_pattern_gif_url;
    
    /* Sample Viewer area */
    COMM.Queue.push(
      function(_json,_style,_sampleTop,_sampleHeight,_tabItem){
        // debugger;
        JSONRenderer.nu(
          _json,
          HView.nu(
            [ 8, _sampleTop, null, _sampleHeight, 416, null ],
            _tabItem, {
              style: _style
            }
          )
        );
      },
      [_options.json,
      [ ['border','1px solid #000'],
        ['background-color','#e6e7e9'],
        ['background-image','url('+_patternUrl+')']
      ],
      _sampleTop,
      _sampleHeight,
      _tabItem]
    );
    
    return _tabItem;
  }
});

