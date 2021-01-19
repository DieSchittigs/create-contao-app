document.querySelectorAll('.ce_accordion').forEach(container => {
    const toggler = container.querySelector('.toggler');
    const content = container.querySelector('.accordion');
    toggler.addEventListener('click', e => {
        container.classList.toggle('open');
    })
});