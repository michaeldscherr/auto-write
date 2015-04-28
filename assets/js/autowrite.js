/*
AutoWrite.js - http://dev.michaeldscherr.com/autowrite
Licensed under the MIT license - http://opensource.org/licenses/MIT

Copyright (c) 2015 Michael Scherr
*/

(function($, win, doc, undefined){
	
	var methods = {
		
		initialize: function(settings){
			
			return this.each(function(){
				
				var $elem = $(this),
						$elem_children = $elem.children();
				
				var $config = {
					type_duration: 2000,
					still_duration: 2000,
					backspace_duration: 1000,
					human_error_max_duration: 100,
					cursor: true,
					cursor_markup: '<span class="line">|</span>'
				};
				
				if(settings){
					$config = $.extend($config, settings);
				}
				
				var $post_markup = ($config.cursor) ? $config.cursor_markup : "&nbsp;";
				
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
						_increment: "forward"
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
					
					var $text_string = $.trim($obj._elem_to_type.data('text')),
							$counter = ($obj._increment === "forward") ? 0 : $text_string.length,
							$end_counter = ($counter === 0) ? ($text_string.length + 1) : -1;
					
					var $options = $.extend($obj,{
						_text_string: $text_string,
						_counter: $counter
					});
					
					var stringRendered = function($duration){
						$options._counter = ($options._increment === "forward") ? ($options._counter+1) : ($options._counter-1);
						if($options._counter === $end_counter){
							setTimeout(function(){
								callback($options._elem_to_type);
							}, $duration);
						}
						else{
							renderString($options, stringRendered);		
						}
					};
					
					renderString($options, stringRendered);
					
				}
				
				function renderString($options, stringRendered){
					
					var $duration = Math.floor(($options._duration_type / $options._text_string.length)),
							$human_delay = Math.round(Math.random() * $config.human_error_max_duration) + 1,
							$full_delay = ($options._increment === "forward") ? ($human_delay + $duration) : $duration,
							$temp_string = $options._text_string.substring(0, $options._counter);
					
					$options._elem_to_type.html($temp_string + $post_markup);
					
					setTimeout(function(){
						stringRendered($duration);
					}, $full_delay);
					
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