# QRD (QR Digital)

Protótipo de mídia física alternativa com acesso digital via QR Code e controle de prazo inspirado no sistema de locadoras clássicas.

## O Conceito

O **QRD** resgata a nostalgia e o ritual de colecionar mídias físicas (como fitas, DVDs e cartuchos), unindo a tangibilidade de uma caixinha com QR code à flexibilidade do streaming moderno. Cada estojo físico traz um código exclusivo que, ao ser escaneado, libera o acesso ao conteúdo por um prazo determinado (ex: 7 dias), simulando a experiência de "alugar, assistir e devolver".

## Como Funciona

1. **O Objeto Físico:** O usuário abre o estojo personalizado e escaneia o QR Code interno com a câmera do celular.
2. **A Validação:** O link abre uma página web segura que utiliza o armazenamento local do navegador para registrar o primeiro acesso.
3. **O Prazo de Exibição:** Um cronômetro regressivo é ativado, permitindo que o filme ou animação seja assistido livremente durante o período de locação. Após o término do prazo, o acesso expira automaticamente.

## Tecnologias Utilizadas

* **HTML5 / CSS3** para a interface do player retrofuturista.
* **JavaScript (Vanilla)** para a lógica de controle de prazo e persistência no `localStorage`.
* **GitHub Pages** para hospedagem da aplicação web.

## Estrutura do Projeto

* `index.html` - Interface principal e player de vídeo.
* `script.js` - Lógica de validação do prazo de locação.
* `style.css` - Estilização visual inspirada em hardware clássico.

---
*Projeto independente criado para explorar inovação em distribuição de animações e design de colecionáveis.*
