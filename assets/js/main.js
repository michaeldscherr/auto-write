(function($, win, doc, undefined){
	
	var methods = {
		
		initialize: function(settings){
			
			return this.each(function(){
				
				var $elem = $(this);
				
				var $config = {
					type_duration: 1000,
					still_duration: 2000
				};
				
				if(settings){
					$config = $.extend($config, settings);
				}
				
				function typeText(){
					
					var active = $elem.children().find('.active').length ? $elem.children().find('.active') : $elem.children().first(),
							next = active.next() ? active.next() : $elem.children().first;
							
					var next_text = next.text().trim();
					
					console.log(next_text);
					
				}
				
				typeText();
				
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