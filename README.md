# slidepanel

A jQuery off-canvas framework.

## Setup

#### HTML Structure

Slidepanel *requires* the following HTML layout.

`<div data-slidepanel="canvas">
    Your website (e.g. header, content, footer, etc.) goes in here.
</div>

<div data-slidepanel="panel right reveal 400">
    Your panel goes in here.
</div>`

#### Data-Slidepanel

You can think of the `data-slidepanel` as a function that accepts 5 parameter. As pointed out in the
example above, `data-slidepanel` is *required* for Slidepanel to work.




<pre><code>
jQuery(document).ready(function($) {
    slidepanel.init();
    $('.panel-button').on('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        slidepanel.toggle('panel');
    });
});
</pre></code>

## Credits

Slidepanel is a completely rewritten and modified version of:
https://www.adchsm.com/slidebars/
