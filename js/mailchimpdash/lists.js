function thickit(dom)
{
	var t = dom.title || dom.name || null;
	var a = dom.href || dom.alt;
	var g = dom.rel || false;
	tb_show(t,a,g);
	dom.blur();
	return false;
}

function listPage(listId, slice)
{
	var url = document.location.href.replace(/\/lists.*/, '/listsajax');
	var lv = $('#lists-view');
	var filters = getFilters();
	lv.load(url, {listid: listId, start: slice, filters: filters});
}

var filters = '';
function getFilters()
{
	filters = '';
	$('#lists-options input').each(function(){
		if ($(this).is(':checked')) {
			if (filters != '') {
				filters += ',';
			}
			filters += $(this).attr('id').replace(/lists-options-/, '');
		}
	});
	return filters;
}

function reloadFilters()
{
	var slice = $('#slice').val();
	var listid = $('#listid').val();
	if (typeof(slice) != undefined && typeof(listid) != undefined) {
		listPage(listid, slice);
	}
}

$(document).ready(function(){
	
	$('#lists-buttons .button').click(function(){
		
		var id = $(this).attr('id').replace(/button_/, '');
		
		var url = document.location.href.replace(/#/, '') + 'ajax';
		
		var imageurl = document.location.href.replace(/index\.php\/mailchimpdash\/lists/, '');
		
		var lv = $('#lists-view');
		
		if (lv.is(':hidden')) {
		
			lv.slideDown(1000, function() {
				listPage(id, 0)
			});
			
		} else {
			
			lv.slideUp(1000, function() {
				lv.html('<div id="lists-loading"><img id="lists-loading" src="'+imageurl+'images/spinner_small.gif" /></div>');
				listPage(id, 0)
				lv.slideDown(1000);
			});
						
			
		}
		
		return false;
	});
	
	$('input[type="checkbox"]').click(function(){reloadFilters();});
	
});


function listremove(obj)
{
	var emailval = $(obj).parent('td').parent('tr').find('td.email a').attr('href').replace(/mailto:/, '');
	var listidval = $('#listid').val();
	var url = document.location.href.replace(/mailchimpdash.*/, 'mailchimpdash/listremoveajax');
	$.post(url,
			{email: emailval, 
			 listid: listidval 
			},
			function(data){
				if (typeof(data) != 'object') {
					var response = JSON.parse(data);
				} else {
					var response = data;
				}
				if (response.success) {
				  set_feedback(response.message, 'success_message', false);
				  $(obj).parent('td').parent('tr').fadeOut(250);
			  } else {
				  set_feedback(response.message, 'error_message', true);
			  }
			},
		  "json"
	  );
	
}

