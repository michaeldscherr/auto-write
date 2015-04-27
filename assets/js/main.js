(function($, win, doc, undefined){
	
	var methods = {
		
		initialize: function(settings){
			
			return this.each(function(){
				
				var $elem = $(this),
						$elem_children = $elem.children();
				
				var $config = {
					type_duration: 3000,
					still_duration: 2000,
					backspace_duration: 1000,
					human_error_max_duration: 100,
					cursor: true,
					cursor_markup: '<span class="line">|</span>'
				};
				
				if(settings){
					$config = $.extend($config, settings);
				}
				
				$post_markup = ($config.cursor) ? $config.cursor_markup : "&nbsp;";
				
				$.each($elem_children, function(index, value){
					
					var $elem = $(value);
					
					$elem.attr('data-text', $elem.text()).
								html($post_markup);
					
				});
				
				function getText(initial){
					
					initial = initial || "false";
					
					var $active = ($elem.find('.active').length) ? $elem.find('.active').first() : $elem_children.first(),
							$next = ($active.next().length) ? $active.next() : $elem_children.first(),
							$elem_to_type = (initial === "true") ? $active : $next;
					
					$elem_to_type.addClass('active').siblings().removeClass('active');
					
					typeText($elem_to_type);
					
				}
				
				function typeText($elem_to_type){
					
					var $callback = function(data){
						setTimeout(function(){
							backspaceText(data);
						},$config.still_duration);
					};
					
					var $obj = {
						_elem_to_type: $elem_to_type,
						_duration_type: $config.type_duration,
						_increment: "plus"
					};
					
					textLoop($obj, $callback);
					
				}
				
				function backspaceText($elem_to_type){
					
					var $callback = function(data){
						setTimeout(function(){
							getText();
						}, $config.still_duration);
					};
					
					var $obj = {
						_elem_to_type: $elem_to_type,
						_duration_type: $config.backspace_duration,
						_increment: "minus"
					};
					
					textLoop($obj, $callback);
					
				}
				
				function textLoop($obj, callback){
					
					var $text_string = $obj._elem_to_type.data('text').trim(),
							$text_string_length = $text_string.length;
					var $duration = Math.floor(($obj._duration_type / $text_string_length)),
							$counter = ($obj._increment === "plus") ? 0 : $text_string_length,
							$end_counter = ($counter === 0) ? $text_string_length : 0;
					
					if($obj._increment_type === "plus"){
						$obj._elem_to_type.text("");
					}
					
					var options = {
						_elem: $obj._elem_to_type
					};
					
					var stringRendered = function(){
						$counter = ($obj._increment === "plus") ? ($counter+1) : ($counter-1);
						if($counter === $end_counter){
							setTimeout(function(){
								callback($obj._elem_to_type);
							}, $duration);
						}
						else{
							renderString($obj._elem_to_type, $text_string, $counter, stringRendered);		
						}
					}
					
					renderString($obj._elem_to_type, $text_string, $counter, stringRendered);
					
				}
				
				function renderString($elem, $text_string, $counter, stringRendered){
					
					var $human_delay = Math.round(Math.random() * $config.human_error_max_duration) + 1,
							$temp_string = $text_string.substring(0, $counter);
					
					$elem.html($temp_string + $post_markup);
					
					setTimeout(function(){
						stringRendered();
					}, $human_delay);
					
				}
				
				getText("true");
				
			});
			
		}
		
	};
	
	$.fn.AutoWrite = function(settings){
		return methods.initialize.apply(this, arguments);
	};
	
	$(function(){
		
		$('[data-role="auto-write"]').AutoWrite();
		
	});
	
})(jQuery, window, document);