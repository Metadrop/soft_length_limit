(function ($) {

  var sll = sll || {};

  Drupal.behaviors.softLengthLimit = {
    attach: function (context, settings) {
      // Preparing the input elements by adding a tooltip container.
      $('.soft-length-limit:not(.soft-length-limit-processed)').each(function(index) {
        $(this).addClass('soft-length-limit-processed');

        var $parent = $(this).parent();
        $parent.css('position','relative');
        $parent.append('<div class="soft-length-limit-tooltip description"></div>');
        $element = $(this);
      });

      var $softLengthElement = $('.soft-length-limit');

      // Calculates the correct position of the tooltip and shows it.
      $softLengthElement.focus(function(event){
        var $tooltip = $(this).parent().find('.soft-length-limit-tooltip');
        $(this).trigger('textchange', $(this).val());

        $tooltip.fadeIn('fast');
      });

      // Hides the tooltip.
      $softLengthElement.blur(function(event){
        var $tooltip = $(this).parent().find('.soft-length-limit-tooltip');
        $tooltip.fadeOut('fast');
      });

      // Shows the relevant info to the user in the tooltip.
      $softLengthElement.bind('textchange', sll.refreshTooltip);
    }
  };

  sll.refreshTooltip = function(event, prevText) {
    let limit = $(this).attr('data-soft-length-limit');
    let minimum = $(this).attr('data-soft-length-minimum');
    let val = $(this).val();
    let remaining = limit - val.length;
    let $tooltip = $(this).parent().find('.soft-length-limit-tooltip');
    let styleSelect = $(this).attr('data-soft-length-style-select');

    // Removes the "exceeded" class if length is not exceeded.
    if (prevText.length > limit && val.length <= limit) {
      $tooltip.removeClass('exceeded');
      $(this).removeClass('exceeded');
    }

    // Adds the "exceeded" class if length is exceeded.
    if (val.length > limit && !$tooltip.hasClass('exceeded')) {
      $tooltip.addClass('exceeded');
      $(this).addClass('exceeded');
    }

    // Adds the "exceeded" class if the length is less than the minimum, in the case where the minimum is set.
    // Adds the "under-min" class, for under-character-minimum specific behavior. Used for min/enhanced character count.
    if (minimum > 0) {
      if (val.length < minimum) {
        $tooltip.addClass('under-min');
        $(this).addClass('under-min');
      }
      if (val.length >= minimum) {
        $tooltip.removeClass('under-min');
        $(this).removeClass('under-min');
      }
      if (val.length > limit) {
        $tooltip.addClass('exceeded');
        $(this).addClass('exceeded');
      }
      if (val.length <= limit) {
        $tooltip.removeClass('exceeded');
        $(this).removeClass('exceeded');
      }
    }

    // The minimal / enhanced version of character limits.
    if (styleSelect === '1') {
      // No minimum treatment.
      $tooltip.html(Drupal.t('@val/@limit', {
        '@val': val.length,
        '@limit': limit
      }));
      // Add class to tooltip for different CSS treatment (icons, text alignment, etc).
      $tooltip.parent().children('.soft-length-limit-tooltip').addClass('min-style-tooltip');
    }

    // Original character limit treatment.
    if ((styleSelect === '0') || (styleSelect === undefined)) {
      // No minimum value is set.
      if (minimum < 1) {
        if (val.length === 0) {
          $tooltip.html(Drupal.t('Content limited to @limit characters',{
            '@limit': limit
          }));
        }
        else if (remaining < 0) {
          $tooltip.html(Drupal.t('@limit character limit exceeded by @exceed characters.',{
            '@limit': limit,
            '@exceed': -remaining
          }));
        }
        else {
          $tooltip.html(Drupal.t('Content limited to @limit characters. Remaining: @remaining',{
            '@limit': limit,
            '@remaining': remaining
          }));
        }
      }
      // There is a minimum length set.
      else {
        if (val.length === 0) {
          $tooltip.html(Drupal.t('Suggested minimum number of characters is @minimum, current count is @val.  Content limited to @limit characters. ',{
            '@limit': limit,
            '@minimum': minimum,
            '@val': val.length
          }));
        }
        else if (remaining < 0) {
          $tooltip.html(Drupal.t('Suggested minimum number of characters is @minimum, current count is @val.  @limit character limit exceeded by @exceed characters.',{
            '@limit': limit,
            '@exceed': -remaining,
            '@minimum': minimum,
            '@val': val.length
          }));
        }
        else {
          $tooltip.html(Drupal.t('Suggested minimum number of characters is @minimum, current count is @val.  Content limited to @limit characters. Remaining: @remaining.',{
            '@limit': limit,
            '@remaining': remaining,
            '@minimum': minimum,
            '@val': val.length
          }));
        }
      }
    }
  };

})(jQuery);
