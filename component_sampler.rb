class ComponentSampler < GUIPlugin
  def parse_components( msg )
    components = {}
    components_path = File.join( @path, 'components' )
    Dir.entries( components_path ).each do |component_file|
      next if component_file.start_with?('.')
      next unless component_file.end_with?('.yaml')
      component_path = File.join( components_path, component_file )
      next unless File.file?( component_path )
      component_data = yaml_read( component_path )
      json_data = {
        'type' => 'GUITree',
        'version' => 1.0,
        'subviews' => YAML.load( component_data['yaml'] )['subviews']
      }
      component_data['json'] = json_data
      components[ component_file[0..-6] ] = component_data
    end
    return components
  end
  def tab_value( msg )
    ses = get_ses( msg )
    tab_name = "tab_#{ses[:tab_num]}".to_sym
    unless ses.has_key? tab_name
      ses[tab_name] = HValue.new( msg, 0 )
    end
    ses[:tab_num] += 1
    return ses[tab_name].value_id
  end
  def parse_tabtree_src( msg, src, gui, opt )
    src.each do |src_item|
      if src_item.class == Hash
        tab_label = src_item.keys.first
        tab_subviews = src_item[tab_label]
        tab_label = tab_label.gsub('_','&nbsp;')
        gui_item = {
          'HTabItem' => {
            'label' => tab_label
          }
        }
        if tab_subviews.class == Array
          tab_value_id = tab_value( msg )
          gui_item['subviews'] = [{
            'HTab' => {
              'rect' => opt[:rect],
              'bind' => tab_value_id
            },
            'subviews' => []
          }]
          parse_tabtree_src( msg, tab_subviews, gui_item['subviews'].first['subviews'], opt )
        end
        gui.push( gui_item )
      elsif src_item.class == String
        if opt[:params][:components].include?(src_item)
          gui.push( {
            'SampleTabItem' => { 'options' => opt[:params][:components][src_item] }
          } )
        else
          gui.push({'HTabItem'=>{'label'=>src_item}})
        end
      else
        warn "Unknown src_item class (src_item.class): #{src_item.inspect}"
      end
    end
    return gui
  end
  def parse_tabtree( msg, params )
    gui = []
    opt = {
      :rect => [ 0, 8, nil, nil, 0, 0 ],
      :params => params
    }
    src = yaml_read('tab_tree.yaml')
    parse_tabtree_src( msg, src, gui, opt )
  end
  def gui_params( msg )
    params = super
    params[:components] = parse_components( msg )
    get_ses( msg )[:tab_num] = 0
    params[:tab_tree] = parse_tabtree( msg, params )
    # require 'pp'; pp params[:tab_tree]
    params
  end
end
