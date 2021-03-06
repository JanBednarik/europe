# --- main comunication channel ----------------------------------------------

window.channel = Backbone.Radio.channel('main')


# --- keyboard ---------------------------------------------------------------
# http://www.quirksmode.org/js/keys.html

document['onkeypress'] = (e) ->
    evt = e || window.event
    any_key = true

    # standard keys
    if evt.keyCode == 113       # Q
        window.channel.trigger('key', 'left')
    else if evt.keyCode == 119  # W
        window.channel.trigger('key', 'right')
    else if evt.keyCode == 112  # P
        window.channel.trigger('key', 'fire')

    # debug keys
    else if evt.keyCode == 49   # 1
        window.channel.trigger('debug:good', )
    else if evt.keyCode == 48   # 0
        window.channel.trigger('debug:bad')
    else
        any_key = false

    if any_key
        window.channel.trigger('keypress')

    return


# --- helper functions -------------------------------------------------------

make_content_wrapper = () ->
    # el = $('#content').append('<div></div>')
    # el.find('div')
    el = $('#main').append('<div></div>')
    el.find('div')

# http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
display_elapsed = (tenth_seconds) ->
    tenth = Math.round(tenth_seconds % 10)
    sec_num = parseInt(Math.round(tenth_seconds / 10), 10)
    hours   = Math.floor(sec_num / 3600)
    minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    seconds = sec_num - (hours * 3600) - (minutes * 60)

    if hours < 10
        hours = "0#{ hours }"
    if minutes < 10
        minutes = "0#{ minutes }"
    if seconds < 10
        seconds = "0#{ seconds }"

    "#{ minutes }:#{ seconds },#{ tenth }"

calc_optimal_height = (rows, margin, height=780) ->
    out = (height - margin * rows) / rows
    Math.floor(out)


# --- casovac ----------------------------------------------------------------

# delay: launch callback fn **once** after specified time

delay_id = undefined

clear_delay = () ->
    if delay_id != undefined
        window.clearTimeout(delay_id)
    delay_id = undefined

set_delay = (fn, delay) ->
    clear_delay()
    delay_id = window.setTimeout(fn, delay)


# timer: launch **periodically** callback fn

timer_id = undefined

clear_timer = () ->
    if timer_id != undefined
        window.clearInterval(timer_id)
    timer_id = undefined

set_timer = (fn, delay) ->
    clear_timer()
    timer_id = window.setInterval(fn, delay)
