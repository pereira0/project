// Select elements
const helpBtn = document.getElementById('helpBtn');
const helpBox = document.getElementById('helpBox');
const closeHelp = document.getElementById('closeHelp');

// Show the help box when the Help button is clicked
helpBtn.addEventListener('click', () => {
    helpBox.classList.add('visible');
});

// Hide the help box when the close button is clicked
closeHelp.addEventListener('click', () => {
    helpBox.classList.remove('visible');
});

// Hide the help box when clicking outside the help content
helpBox.addEventListener('click', (event) => {
    if (event.target === helpBox) {
        helpBox.classList.remove('visible');
    }
});

const helpLanding = `
    <h2>Precisas de ajuda?</h2>
    <p>Ao longo deste simulador, este espaço vai ter informação que te pode ajudar a compreender a licença parental.</p>
    <p>Para começar podes ver as fontes que ajudaram a construir este simulador:<br>
        1 - <a href="https://www.seg-social.pt/documents/10152/14973/3010_subs%C3%ADdio_parental/f724beed-a5cb-4239-8fcc-fa09d7a6900f">Guia da Segurança Social - Guia Prático do Subsídio Parental (17/10/24)</a><br>
        2 - <a href="https://www.seg-social.pt/subsidio-parental">Página da Segurança Social sobre Subsídio Parental (19/11/24)</a><br>
        3 - <a href="https://www.seg-social.pt/documents/10152/14973/3012_subsidio_parental_alargado/beabeda2-9d43-493a-bfba-f1d5dd7a6691">Guia da Segurança Social - Guia Prático do Subsídio Parental Alargado</a><br>
    </p>
`

export { helpLanding };
