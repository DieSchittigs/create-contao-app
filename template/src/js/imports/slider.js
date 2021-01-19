import { tns } from 'tiny-slider/src/tiny-slider';

document.querySelectorAll('.ce_sliderStart .content-slider').forEach(container => {
    
    const contaoSettings = container.dataset.config.split(',');
    const sliderElement = container.querySelector('.slider-wrapper');

    const tinySlider = tns({
        container: sliderElement,
        items: 1,
        navPosition: 'bottom',
        mouseDrag: true,
        autoplay: contaoSettings[0] > 0,
        autoplayTimeout: contaoSettings[0],
        autoplayHoverPause: true,
        autoplayButtonOutput: false,
        speed: contaoSettings[1],
        startIndex: contaoSettings[2],
        loop: contaoSettings[3],
        controlsText: ['','']
    });

    // Fixes mouseDrag + autoplay bug, see https://github.com/ganlanyuan/tiny-slider/issues/521
    tinySlider.events.on('dragStart', function() {
        tinySlider.pause();
    });
    tinySlider.events.on('dragMove', function() {
        tinySlider.pause();
    });
    tinySlider.events.on('dragEnd', function() {
        tinySlider.pause();
    });
    
});