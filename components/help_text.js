const fontes = `
    1 - <a target="_blank" href="https://www.seg-social.pt/documents/10152/14973/3010_subs%C3%ADdio_parental/f724beed-a5cb-4239-8fcc-fa09d7a6900f">Guia da Segurança Social - Guia Prático do Subsídio Parental (17/10/24)</a><br>
    2 - <a target="_blank" href="https://www.seg-social.pt/subsidio-parental">Página da Segurança Social sobre Subsídio Parental (19/11/24)</a><br>
    3 - <a target="_blank" href="https://www.seg-social.pt/documents/10152/14973/3012_subsidio_parental_alargado/beabeda2-9d43-493a-bfba-f1d5dd7a6691">Guia da Segurança Social - Guia Prático do Subsídio Parental Alargado (17/10/24)</a><br>
`

const helpLanding = `
    <h2>Precisas de ajuda?</h2>
    <p>Ao longo deste simulador, este espaço vai ter informação que te pode ajudar a compreender a licença parental.</p>
    <p>Para começar podes ver as fontes que ajudaram a construir este simulador:<br>${fontes}</p>
`

const helpFirstStep = `
    <h2>Precisas de ajuda?</h2>
    <p>Existem dois tipos de licença parental: a <b>licença parental inicial</b> e a <b>licença parental alargada</b>. Agora ao início vamos focar-nos na licença parental inicial, que pode ser de 120, 150 ou 180 dias. 
        <br>Neste primeiro passo vamos ver como funcionam as primeiras 6 semanas (42 dias) da licença, pois é diferente do resto do tempo da licença parental inicial.    
    </p>
    <p>Fontes:<br>${fontes}</p>
`

const helpThirdStep = `
    <h2>Precisas de ajuda?</h2>
    <p><b>RR - Remuneração de Referência</b>: média das remunerações registadas na SS no período dos seis meses mais antigos dos últimos oito prévios ao mês do impedimento para o trabalho.
    </p>
    <p>Fontes:<br>${fontes}</p>
`

export { helpLanding, helpFirstStep, helpThirdStep };