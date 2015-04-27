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
					cursor: true,
					cursor_markup: '<span class="line">|</span>'
				};
				
				if(settings){
					$config = $.extend($config, settings);
				}
				
				$.each($elem_children, function(){
					$(this).attr('data-text', $(this).text());
					if($config.cursor){
						$(this).html($config.cursor_markup);
					}
					else{
						$(this).html("&nbsp;");
					}
				});
				
				function getText(initial){
					
					initial = initial || "false";
					
					var $active = ($elem.find('.active').length) ? $elem.find('.active').first() : $elem_children.first();
					var $next = ($active.next().length) ? $active.next() : $elem_children.first();
					
					var $elem_to_type = (initial === "true") ? $active : $next;
					
					$elem_children.removeClass('active');
					$elem_to_type.addClass('active');
					
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
							$text_string_length = $text_string.length,
							$duration = Math.floor(($obj._duration_type / $text_string_length)),
							$temp_string = "",
							$counter = ($obj._increment === "plus") ? 0 : $text_string_length,
							$end_counter = ($obj._increment === "plus") ? $text_string_length : 0,
							$interval;
					
					if($obj._increment_type === "plus"){
						$obj._elem_to_type.text("");
					}
					
					$interval = setInterval(function(){
						
						$temp_string = ($obj._increment === "plus") ? $text_string.substring(0, ($counter+1)) : $text_string.substring(0, ($counter-1));
						
						if($config.cursor){
							$obj._elem_to_type.html($temp_string + $config.cursor_markup);	
						}
						else{
							$obj._elem_to_type.html($temp_string + "&nbsp;");	
						}
						
						$counter = ($obj._increment === "plus") ? ($counter+1) : ($counter-1);
						
						if($counter === $end_counter){
							setTimeout(function(){
								clearInterval($interval);
								callback($obj._elem_to_type);
							},$duration);
						}
						
					}, $duration);
					
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