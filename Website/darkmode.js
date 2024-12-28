function init() {
    if (!sessionStorage.getItem('darkmode') && window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches)
        sessionStorage.setItem('darkmode', true);

    SetDarkMode(sessionStorage.getItem('darkmode') === 'true');
    document.getElementById('darkmode').checked = (sessionStorage.getItem('darkmode') === 'true');
    document.getElementById('darkmode').addEventListener('change', () => SetDarkMode(document.getElementById('darkmode').checked));

    function SetDarkMode(setval) {
        if (setval) document.querySelector('html').dataset.darkmode = true;
        else delete document.querySelector('html').dataset.darkmode;

        sessionStorage.setItem('darkmode', setval);
    }

    const tables = document.querySelectorAll('table');
    tables.forEach(table => colorCode(table));
}

document.addEventListener('DOMContentLoaded', init);