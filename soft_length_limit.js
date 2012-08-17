(function ($) {
  Drupal.behaviors.softLengthLimit = {
    attach: function (context, settings) {

      // Adds the soft limit counter to fields with a maxlength
      // defined, if not disabled.
      if (Drupal.settings.soft_length_limit === undefined ||
          Drupal.settings.soft_length_limit.maxlength_counter_disabled === undefined ||
          !Drupal.settings.soft_length_limit.maxlength_counter_disabled) {

        var excluded = [];
        // Gets a list of selectors for elements that should be
        // excluded even though they have a max length.
        if (Drupal.settings.soft_length_limit !== undefined || Drupal.settings.soft_length_limit.maxlength_exclude_selectors !== undefined) {
          excluded = Drupal.settings.soft_length_limit.maxlength_exclude_selectors;
        }
        // Adds soft length limit to the maxlength elements.
        var excludeSelectors = excluded.join(', ');
        $('[maxlength]').not('.soft-length-limit').not(excludeSelectors).each(function(index,val){
          var maxlength = $(this).attr('maxlength');
          $(this).attr('data-soft-length-limit',maxlength);
          $(this).addClass('soft-length-limit');
        });
      }


      // Preparing the input elements by adding a tooltip container.
      $('.soft-length-limit').each(function(index){
        var $parent = $(this).parent();
        $parent.css('position','relative');
        $parent.append('<div class="soft-length-limit-tooltip"></div>');
        $element = $(this);

        // Used for automatically moving the tooltip when resizing the
        // text area.
        $parent.find('.grippie').mousedown({
          element: $(this)
        }, function(event){
          var endDrag = function(event) {
            event.data.element.focus();
            $(document).unbind('mouseup',endDrag);
          };
          $(document).mouseup(event.data,endDrag);
        });
      });

      // Calculates the correct position of the tooltip and shows it.
      $('.soft-length-limit').focus(function(event){
        var $tooltip = $(this).parent().find('.soft-length-limit-tooltip');
        var left = $(this).position().left;
        var top = $(this).position().top;
        var bottom = top + $(this).outerHeight(true);
        var right = left + $(this).outerWidth(true);
        $(this).trigger('textchange', $(this).val());
        $tooltip.css('left', 0).css('top', bottom + 10).css('position', 'absolute');
        $tooltip.fadeIn('fast');
      });

      // Hides the tooltip.
      $('.soft-length-limit').blur(function(event){
        var $tooltip = $(this).parent().find('.soft-length-limit-tooltip');
        $tooltip.fadeOut('fast');
      });

      // Shows the relevant info to the user in the tooltip.
      $('.soft-length-limit').bind('textchange', function(event, prevText){
        var limit = $(this).attr('data-soft-length-limit');
        var val = $(this).val();
        var remaining = limit - val.length;
        var $tooltip = $(this).parent().find('.soft-length-limit-tooltip');

        // Removes the "exceeded" class if length is not exceeded
        // anymore.
        if (prevText.length > limit && val.length <= limit) {
          $tooltip.removeClass('exceeded');
          $(this).removeClass('exceeded');
        }

        // Adds the "exceeded" class if length is exceeded.
        if (prevText.length <= limit && val.length > limit) {
          $tooltip.addClass('exceeded');
          $(this).addClass('exceeded');
        }

        if (val.length === 0) {
          $tooltip.html(Drupal.t('Should contain max. <strong>@limit</strong> characters.',{
            '@limit': limit
          }));

        }
        else if (remaining < 0) {
          $tooltip.html(Drupal.t('<strong>@limit</strong> character limit exceeded by <strong>@exceed</strong> characters',{
            '@limit': limit,
            '@exceed': -remaining
          }));
        }
        else {
          $tooltip.html(Drupal.t('<strong>@remaining</strong> characters left',{
            '@remaining': remaining
          }));
        }
      });
    }
  };

})(jQuery);
