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
					cursor_markup: '<span class="line"></span>'
				};
				
				if(settings){
					$config = $.extend($config, settings);
				}
				
				function getText(initial){
					
					initial = initial || 0;
					
					var $active = $elem_children.find('.active').length ? $elem_children.find('.active').first() : $elem_children.first(),
							$next = $active.next().length ? $active.next() : $elem_children.first();
					
					var $to_type = (initial === 1) ? $active : $next;
					
					$elem_children.removeClass('active');
					$to_type.addClass('active');
					
					typeText($to_type);
					
				}
				
				function typeText($to_type){
					
					var $type_text = $to_type.text().trim(),
							$type_array = new Array();
					
					for(var i=0; i<$type_text.length; i++){
						$type_array[i] = $type_text.charAt(i);
					};
					
					$to_type.text("");
					
					var $interval_speed = ($config.type_duration / $type_array.length),
							$text = "",
							$interval,
							$counter = 0;
					
					$interval = setInterval(function(){
						$text += $type_array[$counter];
						$to_type.text($text);
						$counter++;
						if($counter === $type_array.length){
							clearInterval($interval);
							setTimeout(function(){
								backspaceText($to_type, $type_text, $type_array);
							}, $config.still_duration);
						}
					}, $interval_speed);
					
				}
				
				function backspaceText($to_type, $type_text, $type_array){
					
					var $interval_speed = ($config.backspace_duration / $type_array.length),
							$text,
							$interval,
							$counter = $type_array.length;
							
					$interval = setInterval(function(){
						$text = $type_text.substring(0, $counter - 1);
						$to_type.text($text);
						$counter--;
						if($counter === 0){
							clearInterval($interval);
							getText();
						}
					}, $interval_speed);
					
				}
				
				getText(1);
				
			});
			
		}
		
	};
	
	$.fn.AutoWrite = function(settings){
		return methods.initialize.apply(this, arguments);
	}
	
	$(function(){
		
		$('[data-role="auto-write"]').AutoWrite();
		
	});
	
})(jQuery, window, document)