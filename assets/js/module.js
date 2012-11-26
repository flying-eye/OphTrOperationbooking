
/* Module-specific javascript can be placed here */

$(document).ready(function() {
	$('#et_save').unbind('click').click(function() {
		if (!$(this).hasClass('inactive')) {
			$('#schedule_now').val(0);
			disableButtons();
			return true;
		}
		return false;
	});

	$('#et_save_and_schedule').unbind('click').click(function() {
		if (!$(this).hasClass('inactive')) {
			$('#schedule_now').val(1);
			disableButtons();
			return true;
		}
		return false;
	});

	$('#et_cancel').unbind('click').click(function() {
		if (!$(this).hasClass('inactive')) {
			disableButtons();

			if (m = window.location.href.match(/\/update\/[0-9]+/)) {
				window.location.href = window.location.href.replace('/update/','/view/');
			} else {
				window.location.href = baseUrl+'/patient/episodes/'+et_patient_id;
			}
		}
		return false;
	});

	$('#et_deleteevent').unbind('click').click(function() {
		if (!$(this).hasClass('inactive')) {
			disableButtons();
			return true;
		}
		return false;
	});

	$('#et_canceldelete').unbind('click').click(function() {
		if (!$(this).hasClass('inactive')) {
			disableButtons();

			if (m = window.location.href.match(/\/delete\/[0-9]+/)) {
				window.location.href = window.location.href.replace('/delete/','/view/');
			} else {
				window.location.href = baseUrl+'/patient/episodes/'+et_patient_id;
			}
		} 
		return false;
	});

	$('select.populate_textarea').unbind('change').change(function() {
		if ($(this).val() != '') {
			var cLass = $(this).parent().parent().parent().attr('class').match(/Element.*/);
			var el = $('#'+cLass+'_'+$(this).attr('id'));
			var currentText = el.text();
			var newText = $(this).children('option:selected').text();

			if (currentText.length == 0) {
				el.text(ucfirst(newText));
			} else {
				el.text(currentText+', '+newText);
			}
		}
	});

	$('#cancel').click(function() {
		if (!$(this).hasClass('inactive')) {
			disableButtons();

			$.ajax({
				type: 'POST',
				url: window.location.href,
				data: $('#cancelForm').serialize(),
				dataType: 'json',
				success: function(data) {
					var n=0;
					var html = '';
					$.each(data, function(key, value) {
						html += '<ul><li>'+value+'</li></ul>';
						n += 1;
					});

					if (n == 0) {
						window.location.href = window.location.href.replace(/\/cancel\//,'/view/');
					} else {
						$('div.alertBox').show();
						$('div.alertBox').html(html);
					}

					enableButtons();
					return false;
				}
			});
		}

		return false;
	});

	$('#calendar table td').click(function() {
		var day = $(this).text().match(/[0-9]+/);
		if (day == null) return false;

		if (window.location.href.match(/day=/)) {
			var href = window.location.href.replace(/day=[0-9]+/,'day='+day);
		} else if (window.location.href.match(/\?/)) {
			var href = window.location.href + '&day='+day;
		} else {
			var href = window.location.href + '?day='+day;
		}
		href = href.replace(/(&|\?)session_id=[0-9]+/,'');
		window.location.href = href;
		return false;
	});

	$('button#cancel_scheduling').click(function() {
		if (!$(this).hasClass('inactive')) {
			disableButtons();
			document.location.href = baseUrl + '/patient/episodes/' + patient_id;
		}
		return false;
	});

	$('#bookingForm').validate({
		rules : {
			"Booking[admission_time]" : {
				required: true,
				time: true
			},
			"cancellation_reason" : {
				required: true
			}
		},
		submitHandler: function(form){
			if (!$('#bookingForm button#confirm_slot').hasClass('inactive')) {
				disableButtons();

				var rescheduling = window.location.href.match(/\/reschedule\//) == null ? false : true;
				var event_id = window.location.href.match(/[0-9]+/);

				$.ajax({
					'type': 'POST',
					'url': rescheduling ? baseUrl+'/OphTrOperation/booking/update/'+event_id : baseUrl+'/OphTrOperation/booking/create/'+event_id,
					'data': $('#bookingForm').serialize(),
					'dataType': 'json',
					'success': function(data) {
						var n=0;
						var html = '';
						$.each(data, function(key, value) {
							html += '<ul><li>'+value+'</li></ul>';
							n += 1;
						});
						if (n == 0) {
							window.location.href = baseUrl+'/OphTrOperation/default/view/'+event_id;
						} else {
							$('div.alertBox').show();
							$('div.alertBox').html(html);
						}

						enableButtons();
						return false;
					}
				});

				return false;
			} else {
				return false;
			}
		}
	});

	$('#cancelForm button[type="submit"]').click(function(e) {
		var event_id = window.location.href.match(/[0-9]+/);

		if (!$(this).hasClass('inactive')) {
			$.ajax({
				type: 'POST',
				url: baseUrl+'/OphTrOperation/booking/update/'+event_id,
				data: $('#cancelForm').serialize(),
				dataType: 'json',
				success: function(data) {
					var n=0;
					var html = '';
					$.each(data, function(key, value) {
						html += '<ul><li>'+value+'</li></ul>';
						n += 1;
					});

					if (n == 0) {
						window.location.href = baseUrl+'/OphTrOperation/default/view/'+event_id;
					} else {
						$('div.alertBox').show();
						$('div.alertBox').html(html);
					}

					enableButtons();
					return false;
				}
			});
		}

		return false;
	});

	$(this).undelegate('#firmSelect #firm_id','change').delegate('#firmSelect #firm_id','change',function() {
		var firm_id = $(this).val();
		var operation = $('input[id=operation]').val();
		if (window.location.href.match(/firm_id=/)) {
			var href = window.location.href.replace(/firm_id=([0-9]+|EMG)/,'firm_id='+firm_id);
		} else if (window.location.href.match(/\?/)) {
			var href = window.location.href + '&firm_id='+firm_id;
		} else {
			var href = window.location.href + '?firm_id='+firm_id;
		}
		href = href.replace(/(&|\?)day=[0-9]+/,'').replace(/(&|\?)session_id=[0-9]+/,'');
		window.location.href = href;
	});
});

function ucfirst(str) { str += ''; var f = str.charAt(0).toUpperCase(); return f + str.substr(1); }
