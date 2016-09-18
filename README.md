# Slidepanel

Slidepanel lets you setup unlimited off-canvas panels.

### Features

- Easy to setup
- Only requires jQuery
- Create unlimited off-canvas panels
- 4 Panel Positions (top, right, bottom, left)
- 4 Animation Types

## Setup

### Enqueue Scripts

```HTML
<link rel="stylesheet" href="slidepanel.min.css">
<script src="jquery.js"></script>
<script src="jquery.slidepanel.min.js"></script>
```

### HTML Structure

Slidepanel *requires* the following HTML markup. The name "canvas" inside data-slidepanel is a reserved
name and must be given to the container encapsulating your website. You can place all other panels
before or after the "canvas", but never inside of it.

```HTML
<body>
    <div data-slidepanel="canvas">
        Your website (e.g. header, content, footer, etc.) goes in here.
    </div>
    <div data-slidepanel="my-panel-name right reveal 400 400">
        Your panel goes in here.
    </div>
</body>
```

#### Data-Slidepanel

You can think of the `data-slidepanel` as a function that accepts 5 parameters. However, if the panel
your are addressing is the "canvas", data-slidepanel accepts only that single parameter. As pointed
out above, including data-slidepanel is a requirement.

```HTML
<div data-slidepanel="id position animation open-duration close-duration">
```

- **id:** *(required)* The name of your slidepanel. This can be any name *except* "canvas" which is
  exclusively reserved for encapsulating your website as seen in the example above.
- **position:** *(required)* This can be either: top, bottom, left or right. You can place multiple
  panels in the same position.
- **animation:** *(required)* Set the animation parameter to either: reveal, slide, overlay or shift.
- **open-duration:** *(optional)* This is the animation speed when opening a panel in milliseconds.
  Defaults to 300.
- **close-duration:** *(optional)* This is the animation speed when closing a panel in milliseconds.
  Defaults open-duration.

### jQuery

Simple initialize Slidepanel via `slidepanel.init();` and then, upon your event of choice, call
`slidepanel.toggle();` which takes the **id** of the `data-slidepanel` as it's sole parameter.

```JavaScript
var slidepanel = window.slidepanel;
jQuery(document).ready(function($) {
    slidepanel.init();
    $('.my-button').on( 'click', function() {
        slidepanel.toggle('my-panel-name');
    });
});
```

## Roadmap

- Callback's and event's will be implemented once the plugin has matured.
- Squeeze animation. Squeezes the panel and canvas to show both at the same time.
- Sass variables for bezier animation curves.
- Fixing the bugs.

## Bugs

- Within `slidepanel.init()` the `$(window).on( 'resize', _setPanelsCss );` is not working for new
  canvas size, when panel-width is in percent.
- Panels, when switching from x to y position, show content of other panel to early.
- Close and open functions should really only do that. Currently they are both toggle functions.

## Credits

Slidepanel is a completely rewritten and modified version of:
https://www.adchsm.com/slidebars/
